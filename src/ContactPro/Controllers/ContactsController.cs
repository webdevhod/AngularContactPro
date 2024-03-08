using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using JHipsterNet.Core.Pagination;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Services;
using ContactPro.Crosscutting.Constants;
using ContactPro.Crosscutting.Exceptions;
using ContactPro.Web.Extensions;
using ContactPro.Web.Filters;
using ContactPro.Web.Rest.Utilities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Infrastructure.Web.Rest.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;

namespace ContactPro.Controllers
{
    [Authorize]
    [Route("api/contacts")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private const string EntityName = "contact";
        private readonly ILogger<ContactsController> _log;
        private readonly IContactRepository _contactRepository;
        private readonly ICategoryRepository _categoryRepository;
        private UtilityService _utilityService;
        private EmailService _emailService;

        public ContactsController(ILogger<ContactsController> log,
        IContactRepository contactRepository,
        ICategoryRepository categoryRepository,
        UtilityService utilityService,
        EmailService emailService)
        {
            _log = log;
            _contactRepository = contactRepository;
            _categoryRepository = categoryRepository;
            _utilityService = utilityService;
            _emailService = emailService;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<Contact>> CreateContact([FromBody] Contact contact)
        {
            _log.LogDebug($"REST request to save Contact : {contact}");
            if (contact.Id != 0)
                throw new BadRequestAlertException("A new contact cannot already have an ID", EntityName, "idexists");

            contact.Created = _utilityService.GetNowInUtc();
            contact.UserId = _utilityService.GetCurrentUserId();

            // verify categories
            foreach (Category category in contact.Categories)
            {
                Category categoryFetched = await _categoryRepository.QueryHelper().GetOneAsync(c => c.Id == category.Id && c.UserId.Equals(_utilityService.GetCurrentUserId()));
                if (categoryFetched is null) throw new BadRequestAlertException("Invalid Contact Id or User Id", EntityName, "idnull");
            }

            await _contactRepository.CreateOrUpdateAsync(contact);
            await _contactRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(contact.FullName, EntityName, contact.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateContact(long id, [FromBody] Contact contact)
        {
            _log.LogDebug($"REST request to update Contact : {contact}");
            if (contact.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != contact.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");

            Contact oldContact = await _contactRepository.QueryHelper().Include(c => c.Categories).GetOneAsync(c => c.Id == id && _utilityService.GetCurrentUserId().Equals(c.UserId));
            if (oldContact == null) throw new BadRequestAlertException("Invalid Contact Id or User Id", EntityName, "idnull");

            contact.Created = _utilityService.GetDateTimeInUtc(oldContact.Created ?? DateTime.UtcNow);
            contact.UserId = _utilityService.GetCurrentUserId();

            await ClearOldCategories(oldContact);

            ICollection<Category> categories = new HashSet<Category>();
            foreach (Category category in contact.Categories)
            {
                Category categoryFetched = await _categoryRepository.QueryHelper().Include(c => c.Contacts).GetOneAsync(c => c.Id == category.Id && c.User.Id.Equals(_utilityService.GetCurrentUserId()));
                if (categoryFetched is null) throw new BadRequestAlertException("Invalid Contact Id or User Id", EntityName, "idnull");
                categoryFetched.Contacts.Add(oldContact);
            }
            contact.Categories = categories;

            await _contactRepository.CreateOrUpdateAsync(contact);
            await _contactRepository.SaveChangesAsync();

            return Ok(contact)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(contact.FullName, EntityName, contact.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetAllContacts(IPageable pageable, [FromQuery(Name = "searchTerm")] string searchTerm = "", [FromQuery(Name = "categoryId")] string categoryId = "0")
        {
            _log.LogDebug("REST request to get a page of Contacts");

            IPage<Contact> result = null;

            if (!string.IsNullOrEmpty(searchTerm) && !searchTerm.Equals("undefined"))
            {
                searchTerm = Regex.Replace(HttpUtility.UrlDecode(searchTerm, System.Text.Encoding.UTF8).ToLower(), @"\s+", " ");
                result = await _contactRepository.QueryHelper()
                    .Filter(c => c.User.Id != null && _utilityService.GetCurrentUserId().Equals(c.User.Id) && ((c.FirstName + " " + c.LastName).ToLower().Contains(searchTerm) || (c.LastName + " " + c.FirstName).ToLower().Contains(searchTerm)))
                    .GetPageAsync(pageable);
            }
            else if (Int64.TryParse(categoryId, out long id))
            {
                if (id > 0)
                {
                    result = await _contactRepository.QueryHelper()
                    .Filter(c => c.User.Id != null && _utilityService.GetCurrentUserId().Equals(c.User.Id) && c.Categories.Any(category => category.Id == id))
                    .GetPageAsync(pageable);
                }
            }

            if (result is null)
            {
                Console.WriteLine("result is null");
                result = await _contactRepository.QueryHelper()
                    .Filter(c => c.User.Id != null && _utilityService.GetCurrentUserId().Equals(c.User.Id))
                    .GetPageAsync(pageable);
            }

            return Ok(result.Content).WithHeaders(result.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetContact([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get Contact : {id}");
            var result = await _contactRepository.QueryHelper()
                .Include(contact => contact.Categories)
                .GetOneAsync(contact => contact.Id == id && _utilityService.GetCurrentUserId().Equals(contact.User.Id));
            return ActionResultUtil.WrapOrNotFound(result);
        }

        [HttpGet("{id}/email")]
        public async Task<IActionResult> GetEmailContact([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get Email Contact : {id}");
            var result = await _contactRepository.QueryHelper()
                .Include(contact => contact.Categories)
                .GetOneAsync(contact => contact.Id == id && _utilityService.GetCurrentUserId().Equals(contact.User.Id));
            if (result == null) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            EmailData emailData = new EmailData();
            emailData.Id = id;
            emailData.IsCategory = false;
            emailData.Contacts.Add(result);
            return ActionResultUtil.WrapOrNotFound(emailData);
        }

        [HttpPut("{id}/email")]
        [Authorize(Roles = RolesConstants.ADMIN + "," + RolesConstants.USER)]
        public async Task<IActionResult> SendEmailContact([FromBody] EmailData emailData)
        {
            _log.LogDebug($"REST request to post Email Contact : {emailData.Id}");
            ICollection<Contact> contacts = new HashSet<Contact>();
            foreach (Contact contact in emailData.Contacts)
            {
                var result = await _contactRepository.QueryHelper()
                    .GetOneAsync(c => c.Id == contact.Id && _utilityService.GetCurrentUserId().Equals(c.User.Id));
                if (result == null) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
                contacts.Add(result);
            }

            await _emailService.SendEmailAsync(contacts, emailData.Subject, emailData.Body);

            return NoContent().WithHeaders(HeaderUtil.CreateEntityEmailAlert(string.Join(", ", emailData.Contacts.Select(c => c.Email).ToList()), EntityName, emailData.Id.ToString()));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete Contact : {id}");
            Contact contact = await _contactRepository.QueryHelper()
                .GetOneAsync(contact => contact.Id == id && _utilityService.GetCurrentUserId().Equals(contact.User.Id));
            if (contact == null) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            await _contactRepository.DeleteByIdAsync(id);
            await _contactRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(contact.FullName, EntityName, id.ToString()));
        }

        private async Task ClearOldCategories(Contact oldContact)
        {
            int count = 0;
            foreach (Category category in oldContact.Categories)
            {
                Category oldCategory = await _categoryRepository.QueryHelper().Include(c => c.Contacts).GetOneAsync(c => c.Id == category.Id && c.UserId.Equals(_utilityService.GetCurrentUserId()));
                if (oldCategory is null) throw new BadRequestAlertException("Invalid Contact Id or User Id", EntityName, "idnull");
                oldCategory.Contacts.Remove(oldContact);
                await _categoryRepository.CreateOrUpdateAsync(oldCategory);
                ++count;
            }

            if (count > 0) await _categoryRepository.SaveChangesAsync();

            oldContact.Categories = new HashSet<Category>();
            await _contactRepository.CreateOrUpdateAsync(oldContact);
        }
    }
}
