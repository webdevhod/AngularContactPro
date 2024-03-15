// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using ContactPro.Crosscutting.Constants;
using ContactPro.Crosscutting.Exceptions;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Domain.Services;
using ContactPro.Infrastructure.Web.Rest.Utilities;
using ContactPro.Web.Extensions;
using ContactPro.Web.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ContactPro.Controllers
{
    [Route("api/emails")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private const string EntityName = "email";
        private readonly ILogger<EmailController> _log;
        private readonly IContactRepository _contactRepository;
        private UtilityService _utilityService;
        private EmailService _emailService;


        public EmailController(ILogger<EmailController> log,
            IContactRepository contactRepository,
            UtilityService utilityService,
            EmailService emailService)
        {
            _log = log;
            _utilityService = utilityService;
            _contactRepository = contactRepository;
            _emailService = emailService;
        }

        // POST api/<EmailController>
        [HttpPost]
        [ValidateModel]
        [Authorize(Roles = RolesConstants.ADMIN + "," + RolesConstants.USER)]
        public async Task<IActionResult> Post([FromBody] EmailData emailData)
        {
            string contactsToList = string.Join(", ", emailData.Contacts.Select(c => c.Email).ToList());
            _log.LogDebug($"REST request to post Email : {contactsToList}");
            ICollection<Contact> contacts = new HashSet<Contact>();

            foreach (Contact contact in emailData.Contacts)
            {
                var result = await _contactRepository.QueryHelper()
                    .GetOneAsync(c => c.Id == contact.Id && _utilityService.GetCurrentUserId().Equals(c.UserId));
                if (result == null) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
                contacts.Add(result);
            }

            await _emailService.SendEmailAsync(contacts, emailData.Subject, emailData.Message);

            return NoContent().WithHeaders(HeaderUtil.CreateEntityEmailAlert(contactsToList, EntityName, $"Email sent to contacts"));
        }
    }
}
