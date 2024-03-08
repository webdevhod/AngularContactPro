using ContactPro.Crosscutting.Constants;
using ContactPro.Crosscutting.Exceptions;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Domain.Services;
using ContactPro.Infrastructure.Data;
using ContactPro.Infrastructure.Web.Rest.Utilities;
using ContactPro.Web.Extensions;
using ContactPro.Web.Filters;
using ContactPro.Web.Rest.Utilities;
using JHipsterNet.Core.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactPro.Controllers
{
    [Authorize]
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private const string EntityName = "category";
        private readonly ILogger<CategoriesController> _log;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IContactRepository _contactRepository;
        private readonly ApplicationDatabaseContext _context;
        private UtilityService _utilityService;
        private EmailService _emailService;


        public CategoriesController(ILogger<CategoriesController> log,
        ICategoryRepository categoryRepository,
        IContactRepository contactRepository,
        ApplicationDatabaseContext context,
        UtilityService utilityService,
        EmailService emailService
        )
        {
            _log = log;
            _categoryRepository = categoryRepository;
            _contactRepository = contactRepository;
            _context = context;
            _utilityService = utilityService;
            _emailService = emailService;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<Category>> CreateCategory([FromBody] Category category)
        {
            _log.LogDebug($"REST request to save Category : {category}");
            if (category.Id != 0)
                throw new BadRequestAlertException("A new category cannot already have an ID", EntityName, "idexists");

            category.Created = _utilityService.GetNowInUtc();
            category.UserId = _utilityService.GetCurrentUserId();
            await CheckAllContacts(category);

            await _categoryRepository.CreateOrUpdateAsync(category);
            await _categoryRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(category.Name, EntityName, category.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateCategory(long id, [FromBody] Category category)
        {
            _log.LogDebug($"REST request to update Category : {category}");
            if (category.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != category.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            if (!_utilityService.GetCurrentUserId().Equals(category.UserId)) throw new BadRequestAlertException("User Id and Category User Id doesn't match", EntityName, "useridmatch");
            Category oldCategory = await _categoryRepository.QueryHelper().GetOneAsync(c => c.Id == id && _utilityService.GetCurrentUserId().Equals(c.User.Id));
            if (oldCategory == null) throw new BadRequestAlertException("Invalid Category Id or User Id", EntityName, "idnull");

            await CheckAllContacts(category);

            oldCategory.Contacts = new HashSet<Contact>();
            await _categoryRepository.CreateOrUpdateAsync(oldCategory);
            await _categoryRepository.SaveChangesAsync();
            await _categoryRepository.CreateOrUpdateAsync(category);
            await _categoryRepository.SaveChangesAsync();
            return Ok(category)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(category.Name, EntityName, category.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories(IPageable pageable, [FromQuery] bool eagerLoad = false)
        {
            _log.LogDebug("REST request to get a page of Categories");
            IPage<Category> result = null;

            if (eagerLoad)
            {
                result = await _categoryRepository.QueryHelper()
                    .Include(c => c.Contacts)
                    .Filter(c => c.UserId != null && _utilityService.GetCurrentUserId().Equals(c.UserId))
                    .GetPageAsync(pageable);
            }
            else
            {
                result = await _categoryRepository.QueryHelper()
                    .Filter(c => c.UserId != null && _utilityService.GetCurrentUserId().Equals(c.UserId))
                    .GetPageAsync(pageable);
            }

            return Ok(result.Content).WithHeaders(result.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get Category : {id}");
            var result = await _categoryRepository.QueryHelper()
                .Include(category => category.Contacts)
                .GetOneAsync(category => category.Id == id && _utilityService.GetCurrentUserId().Equals(category.UserId));
            return ActionResultUtil.WrapOrNotFound(result);
        }

        [HttpGet("{id}/email")]
        public async Task<IActionResult> GetEmailCategory([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get Email Category : {id}");
            var result = await _categoryRepository.QueryHelper()
                .Include(category => category.Contacts)
                .GetOneAsync(category => category.Id == id && _utilityService.GetCurrentUserId().Equals(category.UserId));
            if (result == null) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            EmailData emailData = new EmailData();
            emailData.Id = id;
            emailData.IsCategory = true;
            foreach (Contact contact in result.Contacts)
            {
                emailData.Contacts.Add(contact);
            }
            return ActionResultUtil.WrapOrNotFound(emailData);
        }

        [HttpPut("{id}/email")]
        [Authorize(Roles = RolesConstants.ADMIN + "," + RolesConstants.USER)]
        public async Task<IActionResult> SendEmailContact([FromBody] EmailData emailData)
        {
            _log.LogDebug($"REST request to post Email Category : {emailData.Id}");
            ICollection<Contact> contacts = new HashSet<Contact>();
            foreach (Contact contact in emailData.Contacts)
            {
                var result = await _contactRepository.QueryHelper()
                    .GetOneAsync(c => c.Id == contact.Id && _utilityService.GetCurrentUserId().Equals(c.UserId));
                if (result == null) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
                contacts.Add(result);
            }

            await _emailService.SendEmailAsync(contacts, emailData.Subject, emailData.Body);

            return NoContent().WithHeaders(HeaderUtil.CreateEntityEmailAlert(string.Join(", ", emailData.Contacts.Select(c => c.Email).ToList()), EntityName, emailData.Id.ToString()));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete Category : {id}");

            Category category = await _categoryRepository.QueryHelper()
                .GetOneAsync(category => category.Id == id && _utilityService.GetCurrentUserId().Equals(category.UserId));
            if (category == null) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");

            await _categoryRepository.DeleteByIdAsync(id);
            await _categoryRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(category.Name, EntityName, id.ToString()));
        }

        private async Task CheckAllContacts(Category category)
        {
            foreach (Contact contact in category.Contacts)
            {
                Contact fetchedContact = await _context.Contacts.FirstOrDefaultAsync(c => c.Id == contact.Id && _utilityService.GetCurrentUserId().Equals(c.UserId));
                if (fetchedContact is null) throw new BadRequestAlertException("Invalid Contact Id", EntityName, "idinvalid");
            }
        }
    }
}
