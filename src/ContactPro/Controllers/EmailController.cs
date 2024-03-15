// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using ContactPro.Crosscutting.Constants;
using ContactPro.Crosscutting.Exceptions;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Domain.Services;
using ContactPro.Infrastructure.Data;
using ContactPro.Infrastructure.Web.Rest.Utilities;
using ContactPro.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Serilog;
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
        //private readonly ICategoryRepository _categoryRepository;
        private readonly IContactRepository _contactRepository;
        //private readonly ApplicationDatabaseContext _context;
        private UtilityService _utilityService;
        private EmailService _emailService;


        public EmailController(ILogger<EmailController> log,
     //ICategoryRepository categoryRepository,
      IContactRepository contactRepository,
      //ApplicationDatabaseContext context,
      UtilityService utilityService,
      EmailService emailService
      )
        {
            _log = log;
/*            _categoryRepository = categoryRepository;
            _contactRepository = contactRepository;
            _context = context;
            _utilityService = utilityService;*/
            _emailService = emailService;
        }
        /*        // GET: api/<EmailController>
                [HttpGet]
                public IEnumerable<string> Get()
                {
                    return new string[] { "value1", "value2" };
                }

                // GET api/<EmailController>/5
                [HttpGet("{id}")]
                public string Get(int id)
                {
                    return "value";
                }*/

        // POST api/<EmailController>
        [HttpPost]
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
            await _emailService.SendEmailAsync(contacts, emailData.Subject, emailData.Body);

            return NoContent().WithHeaders(HeaderUtil.CreateEntityEmailAlert(contactsToList, EntityName, emailData.Id.ToString()));
        }

/*        // PUT api/<EmailController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<EmailController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }*/
    }
}
