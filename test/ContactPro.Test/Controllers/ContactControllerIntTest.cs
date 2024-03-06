using System;

using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using FluentAssertions.Extensions;
using ContactPro.Infrastructure.Data;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Crosscutting.Enums;
using ContactPro.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace ContactPro.Test.Controllers
{
    public class ContactsControllerIntTest
    {
        public ContactsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _contactRepository = _factory.GetRequiredService<IContactRepository>();


            InitTest();
        }

        private const string DefaultFirstName = "AAAAAAAAAA";
        private const string UpdatedFirstName = "BBBBBBBBBB";

        private const string DefaultLastName = "AAAAAAAAAA";
        private const string UpdatedLastName = "BBBBBBBBBB";

        private const string DefaultAddress1 = "AAAAAAAAAA";
        private const string UpdatedAddress1 = "BBBBBBBBBB";

        private const string DefaultAddress2 = "AAAAAAAAAA";
        private const string UpdatedAddress2 = "BBBBBBBBBB";

        private const string DefaultCity = "AAAAAAAAAA";
        private const string UpdatedCity = "BBBBBBBBBB";

        private const States DefaultState = States.AL;
        private const States UpdatedState = States.AL;

        private const string DefaultZipCode = "AAAAAAAAAA";
        private const string UpdatedZipCode = "BBBBBBBBBB";

        private const string DefaultEmail = "AAAAAAAAAA";
        private const string UpdatedEmail = "BBBBBBBBBB";

        private const string DefaultPhoneNumber = "AAAAAAAAAA";
        private const string UpdatedPhoneNumber = "BBBBBBBBBB";

        private static readonly DateTime? DefaultBirthDate = DateTime.UnixEpoch;
        private static readonly DateTime? UpdatedBirthDate = DateTime.UtcNow;

        private static readonly DateTime? DefaultCreated = DateTime.UnixEpoch;
        private static readonly DateTime? UpdatedCreated = DateTime.UtcNow;

        private static readonly byte[] DefaultImageData = new byte[0];

        private static readonly byte[] UpdatedImageData = { 0x01, 0x02, 0x03, 0x04 };

        private const string DefaultImageType = "AAAAAAAAAA";
        private const string UpdatedImageType = "BBBBBBBBBB";

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IContactRepository _contactRepository;

        private Contact _contact;


        private Contact CreateEntity()
        {
            return new Contact
            {
                FirstName = DefaultFirstName,
                LastName = DefaultLastName,
                Address1 = DefaultAddress1,
                Address2 = DefaultAddress2,
                City = DefaultCity,
                State = DefaultState,
                ZipCode = DefaultZipCode,
                Email = DefaultEmail,
                PhoneNumber = DefaultPhoneNumber,
                BirthDate = DefaultBirthDate,
                Created = DefaultCreated,
                ImageData = DefaultImageData,
                ImageType = DefaultImageType,
            };
        }

        private void InitTest()
        {
            _contact = CreateEntity();
        }

        [Fact]
        public async Task CreateContact()
        {
            var databaseSizeBeforeCreate = await _contactRepository.CountAsync();

            // Create the Contact
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Contact in the database
            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testContact = contactList.Last();
            testContact.FirstName.Should().Be(DefaultFirstName);
            testContact.LastName.Should().Be(DefaultLastName);
            testContact.Address1.Should().Be(DefaultAddress1);
            testContact.Address2.Should().Be(DefaultAddress2);
            testContact.City.Should().Be(DefaultCity);
            testContact.State.Should().Be(DefaultState);
            testContact.ZipCode.Should().Be(DefaultZipCode);
            testContact.Email.Should().Be(DefaultEmail);
            testContact.PhoneNumber.Should().Be(DefaultPhoneNumber);
            testContact.BirthDate.Should().Be(DefaultBirthDate);
            testContact.Created.Should().Be(DefaultCreated);
            testContact.ImageData.Should().Equal(DefaultImageData);
            testContact.ImageType.Should().Be(DefaultImageType);
        }

        [Fact]
        public async Task CreateContactWithExistingId()
        {
            var databaseSizeBeforeCreate = await _contactRepository.CountAsync();
            // Create the Contact with an existing ID
            _contact.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Contact in the database
            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task CheckFirstNameIsRequired()
        {
            var databaseSizeBeforeTest = await _contactRepository.CountAsync();

            // Set the field to null
            _contact.FirstName = null;

            // Create the Contact, which fails.
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckLastNameIsRequired()
        {
            var databaseSizeBeforeTest = await _contactRepository.CountAsync();

            // Set the field to null
            _contact.LastName = null;

            // Create the Contact, which fails.
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckAddress1IsRequired()
        {
            var databaseSizeBeforeTest = await _contactRepository.CountAsync();

            // Set the field to null
            _contact.Address1 = null;

            // Create the Contact, which fails.
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckCityIsRequired()
        {
            var databaseSizeBeforeTest = await _contactRepository.CountAsync();

            // Set the field to null
            _contact.City = null;

            // Create the Contact, which fails.
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckStateIsRequired()
        {
            var databaseSizeBeforeTest = await _contactRepository.CountAsync();

            // Set the field to null
            // _contact.State = None;

            // Create the Contact, which fails.
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckZipCodeIsRequired()
        {
            var databaseSizeBeforeTest = await _contactRepository.CountAsync();

            // Set the field to null
            _contact.ZipCode = null;

            // Create the Contact, which fails.
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckEmailIsRequired()
        {
            var databaseSizeBeforeTest = await _contactRepository.CountAsync();

            // Set the field to null
            _contact.Email = null;

            // Create the Contact, which fails.
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task CheckPhoneNumberIsRequired()
        {
            var databaseSizeBeforeTest = await _contactRepository.CountAsync();

            // Set the field to null
            _contact.PhoneNumber = null;

            // Create the Contact, which fails.
            var response = await _client.PostAsync("/api/contacts", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task GetAllContacts()
        {
            // Initialize the database
            await _contactRepository.CreateOrUpdateAsync(_contact);
            await _contactRepository.SaveChangesAsync();

            // Get all the contactList
            var response = await _client.GetAsync("/api/contacts?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_contact.Id);
            json.SelectTokens("$.[*].firstName").Should().Contain(DefaultFirstName);
            json.SelectTokens("$.[*].lastName").Should().Contain(DefaultLastName);
            json.SelectTokens("$.[*].address1").Should().Contain(DefaultAddress1);
            json.SelectTokens("$.[*].address2").Should().Contain(DefaultAddress2);
            json.SelectTokens("$.[*].city").Should().Contain(DefaultCity);
            json.SelectTokens("$.[*].state").Should().Contain(DefaultState.ToString());
            json.SelectTokens("$.[*].zipCode").Should().Contain(DefaultZipCode);
            json.SelectTokens("$.[*].email").Should().Contain(DefaultEmail);
            json.SelectTokens("$.[*].phoneNumber").Should().Contain(DefaultPhoneNumber);
            json.SelectTokens("$.[*].birthDate").Should().Contain(DefaultBirthDate);
            json.SelectTokens("$.[*].created").Should().Contain(DefaultCreated);
            json.SelectTokens("$.[*].imageData").Should().Contain(DefaultImageData);
            json.SelectTokens("$.[*].imageType").Should().Contain(DefaultImageType);
        }

        [Fact]
        public async Task GetContact()
        {
            // Initialize the database
            await _contactRepository.CreateOrUpdateAsync(_contact);
            await _contactRepository.SaveChangesAsync();

            // Get the contact
            var response = await _client.GetAsync($"/api/contacts/{_contact.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_contact.Id);
            json.SelectTokens("$.firstName").Should().Contain(DefaultFirstName);
            json.SelectTokens("$.lastName").Should().Contain(DefaultLastName);
            json.SelectTokens("$.address1").Should().Contain(DefaultAddress1);
            json.SelectTokens("$.address2").Should().Contain(DefaultAddress2);
            json.SelectTokens("$.city").Should().Contain(DefaultCity);
            json.SelectTokens("$.state").Should().Contain(DefaultState.ToString());
            json.SelectTokens("$.zipCode").Should().Contain(DefaultZipCode);
            json.SelectTokens("$.email").Should().Contain(DefaultEmail);
            json.SelectTokens("$.phoneNumber").Should().Contain(DefaultPhoneNumber);
            json.SelectTokens("$.birthDate").Should().Contain(DefaultBirthDate);
            json.SelectTokens("$.created").Should().Contain(DefaultCreated);
            json.SelectTokens("$.imageData").Should().Contain(DefaultImageData);
            json.SelectTokens("$.imageType").Should().Contain(DefaultImageType);
        }

        [Fact]
        public async Task GetNonExistingContact()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/contacts/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateContact()
        {
            // Initialize the database
            await _contactRepository.CreateOrUpdateAsync(_contact);
            await _contactRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _contactRepository.CountAsync();

            // Update the contact
            var updatedContact = await _contactRepository.QueryHelper().GetOneAsync(it => it.Id == _contact.Id);
            // Disconnect from session so that the updates on updatedContact are not directly saved in db
            //TODO detach
            updatedContact.FirstName = UpdatedFirstName;
            updatedContact.LastName = UpdatedLastName;
            updatedContact.Address1 = UpdatedAddress1;
            updatedContact.Address2 = UpdatedAddress2;
            updatedContact.City = UpdatedCity;
            updatedContact.State = UpdatedState;
            updatedContact.ZipCode = UpdatedZipCode;
            updatedContact.Email = UpdatedEmail;
            updatedContact.PhoneNumber = UpdatedPhoneNumber;
            updatedContact.BirthDate = UpdatedBirthDate;
            updatedContact.Created = UpdatedCreated;
            updatedContact.ImageData = UpdatedImageData;
            updatedContact.ImageType = UpdatedImageType;

            var response = await _client.PutAsync($"/api/contacts/{_contact.Id}", TestUtil.ToJsonContent(updatedContact));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Contact in the database
            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testContact = contactList.Last();
            testContact.FirstName.Should().Be(UpdatedFirstName);
            testContact.LastName.Should().Be(UpdatedLastName);
            testContact.Address1.Should().Be(UpdatedAddress1);
            testContact.Address2.Should().Be(UpdatedAddress2);
            testContact.City.Should().Be(UpdatedCity);
            testContact.State.Should().Be(UpdatedState);
            testContact.ZipCode.Should().Be(UpdatedZipCode);
            testContact.Email.Should().Be(UpdatedEmail);
            testContact.PhoneNumber.Should().Be(UpdatedPhoneNumber);
            testContact.BirthDate.Should().Be(UpdatedBirthDate);
            testContact.Created.Should().Be(UpdatedCreated);
            testContact.ImageData.Should().Equal(UpdatedImageData);
            testContact.ImageType.Should().Be(UpdatedImageType);
        }

        [Fact]
        public async Task UpdateNonExistingContact()
        {
            var databaseSizeBeforeUpdate = await _contactRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            var response = await _client.PutAsync("/api/contacts/1", TestUtil.ToJsonContent(_contact));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Contact in the database
            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteContact()
        {
            // Initialize the database
            await _contactRepository.CreateOrUpdateAsync(_contact);
            await _contactRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _contactRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/contacts/{_contact.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var contactList = await _contactRepository.GetAllAsync();
            contactList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Contact));
            var contact1 = new Contact
            {
                Id = 1L
            };
            var contact2 = new Contact
            {
                Id = contact1.Id
            };
            contact1.Should().Be(contact2);
            contact2.Id = 2L;
            contact1.Should().NotBe(contact2);
            contact1.Id = 0;
            contact1.Should().NotBe(contact2);
        }
    }
}
