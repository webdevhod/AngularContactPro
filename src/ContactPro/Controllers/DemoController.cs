using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ContactPro.Crosscutting.Constants;
using ContactPro.Crosscutting.Enums;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Domain.Services;
using ContactPro.Domain.Services.Interfaces;
using ContactPro.Security.Jwt;
using ContactPro.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ContactPro.Controllers
{
    [Route("api/demo")]
    [ApiController]
    public class DemoController : ControllerBase
    {
        private readonly ILogger<DemoController> _log;
        private readonly UserManager<User> _userManager;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IAuthenticationService _authenticationService;
        private readonly ITokenProvider _tokenProvider;
        private readonly UtilityService _utilityService;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IContactRepository _contactRepository;
        private readonly IWebHostEnvironment _environment;
        IList<Address> _addressList;
        IList<Person> _personList;
        IList<string> _dobList;
        IList<string> _emailList;


        public DemoController(
            ILogger<DemoController> log,
            UserManager<User> userManager,
            IPasswordHasher<User> passwordHasher,
            IAuthenticationService authenticationService,
            ITokenProvider tokenProvider,
            UtilityService utilityService,
            ICategoryRepository categoryRepository,
            IContactRepository contactRepository,
            IWebHostEnvironment environment
        )
        {
            _log = log;
            _userManager = userManager;
            _passwordHasher = passwordHasher;
            _authenticationService = authenticationService;
            _tokenProvider = tokenProvider;
            _utilityService = utilityService;
            _categoryRepository = categoryRepository;
            _contactRepository = contactRepository;
            _environment = environment;

            _addressList = new List<Address>(){
                new Address("103 Meridith Dr", "Aberdeen", States.NC, "28315", "(910) 944-9646"),
                new Address("1628 S Bayless St", "Anaheim", States.CA, "92802", "(714) 635-4835"),
                new Address("3810 Marion Marysville Rd", "Prospect", States.OH, "43342", "(740) 751-4129"),
                new Address("4091 Country Ln NW", "Bremerton", States.WA, "98312", "(360) 479-4063"),
                new Address("928 Greenwood Ave #I", "Monroe", States.MI, "48162", "(734) 240-4802"),
                new Address("1415 22nd St", "Columbus", States.IN, "47201", "(812) 372-1606"),
                new Address("633 Heather Stone Dr", "Merritt Island", States.FL, "32953", "(321) 452-8617"),
                new Address("159 Asbury Hts SE", "Crawfordville", States.GA, "30631", "(706) 456-2475"),
                new Address("6515 N Harrison St", "Davenport", States.IA, "52806", "(563) 424-5793"),
                new Address("260 Camel Bend Ct", "Schaumburg", States.IL, "60194", "(847) 798-9253")
            };

            string folderPath = _environment.WebRootPath + "/content/img/";

            _personList = new List<Person>(){
                new Person("Claudia", "Black", folderPath + "ClaudiaBlack.png"),
                new Person("Courtenay", "Taylor", folderPath + "CourtenayTaylor.png"),
                new Person("Frank", "Langella", folderPath + "FrankLangella.png"),
                new Person("Gina", "Torres", folderPath + "GinaTorres.png"),
                new Person("Lance", "Reddick", folderPath + "LanceReddick.png"),
                new Person("Moira", "Quirk", folderPath + "MoiraQuirk.png"),
                new Person("Nathan", "Fillion", folderPath + "NathanFillion.png"),
                new Person("Neil", "Kaplan", folderPath + "NeilKaplan.png"),
                new Person("Nolan", "North", folderPath + "NolanNorth.png"),
                new Person("Page", "Leong", folderPath + "PageLeong.png")
            };

            _dobList = new List<string>() {
                "1996-10-19",
                "1997-09-25",
                "1986-09-10",
                "1989-04-09",
                "1986-10-30",
                "1991-08-06",
                "1994-04-12",
                "1983-03-16",
                "1986-11-22",
                "1987-05-16"
            };

            _emailList = new List<string>() {
                "geeber@gmail.com",
                "ranvm@optonline.net",
                "murdocj@verizon.net",
                "teverett@sbcglobal.net",
                "kildjean@sbcglobal.net",
                "birddog@verizon.net",
                "noodles@optonline.net",
                "debest@optonline.net",
                "aardo@att.net",
                "smone@optonline.net"
            };
        }

        private string GetRandomString(int length) {
            string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            IList<char> str = new List<char>();
            Random random = new Random();
            for(int i = 0; i < length; ++i)
            {
                str.Add(chars[random.Next(chars.Length)]);
            }
            return string.Join("", str);
        }

        private async Task CreateDummyData(User user) {
            _log.LogDebug($"Creating Contacts for User: {user}");

            HashSet<int> personIndices = new HashSet<int>();
            HashSet<int> addressIndices = new HashSet<int>();
            HashSet<int> emailIndices = new HashSet<int>();
            HashSet<int> dobIndices = new HashSet<int>();
            IList<Contact> savedContacts = new List<Contact>();
            Random random = new Random();

            for(int i = 0; i < 3; ++i)
            {
                int personIndex = random.Next(0, 10);
                while (personIndices.Contains(personIndex))
                {
                    personIndex = random.Next(0, 10);
                }

                int addressIndex = random.Next(0, 10);
                while (addressIndices.Contains(addressIndex))
                {
                    addressIndex = random.Next(0, 10);
                }

                int emailIndex = random.Next(0, 10);
                while (emailIndices.Contains(emailIndex))
                {
                    emailIndex = random.Next(0, 10);
                }

                int dobIndex = random.Next(0, 10);
                while (dobIndices.Contains(dobIndex))
                {
                    dobIndex = random.Next(0, 10);
                }
                personIndices.Add(personIndex);
                addressIndices.Add(addressIndex);
                emailIndices.Add(emailIndex);
                dobIndices.Add(dobIndex);

                Person person = _personList[personIndex];
                Address address = _addressList[addressIndex];
                string email = _emailList[emailIndex];
                string dob = _dobList[dobIndex];

                Contact contact = new Contact();
                contact.UserId = user.Id;
                contact.FirstName = person.firstName;
                contact.LastName = person.lastName;
                contact.ImageData = System.IO.File.ReadAllBytes(person.imagePath);
                contact.ImageType = System.IO.Path.GetExtension(person.imagePath);
                contact.Address1 = address.address;
                contact.City = address.city;
                contact.State = address.state;
                contact.ZipCode = address.zipCode;
                contact.PhoneNumber = address.phoneNumber;
                contact.Email = email;
                contact.BirthDate = DateTime.Parse(dob);
                contact.Created = _utilityService.GetNowInUtc();
                contact = await _contactRepository.CreateOrUpdateAsync(contact);
                savedContacts.Add(contact);
                _log.LogDebug($"Saved Information for Contacts : {contact}");
            }
            await _contactRepository.SaveChangesAsync();

            // adding category data
            IList<string> categoryNames = new List<string>() { "Friends", "Family", "Co-workers" };
            for(int j = 0; j < 3; ++j)
            {
                Category category = new Category();
                category.Name = categoryNames[j];
                category.UserId = user.Id;
                category.Created = _utilityService.GetNowInUtc();
                category.Contacts.Add(savedContacts[j]);
                category = await _categoryRepository.CreateOrUpdateAsync(category);
                _log.LogDebug($"Saved Information for Contacts : {category}");
            }
            await _categoryRepository.SaveChangesAsync();

            _log.LogDebug($"Created Data for User: {user}");
        }

        [AllowAnonymous]
        public async Task<ActionResult<User>> Demo()
        {
            _log.LogDebug($"REST request to create Demo User");
            string lastName = GetRandomString(5);
            string loginName = "guest" + lastName;
            string password = "password";
            string hashedPassword = _passwordHasher.HashPassword(null, password);

            User newUser = new User
            {
                Login = loginName,
                PasswordHash = hashedPassword,
                FirstName = "Guest",
                LastName = lastName,
                Email = loginName.ToLower() + "@mail.com",
                LangKey = "en",
                Activated = true
            };
            await _userManager.CreateAsync(newUser);
            
            User userFetched = await _userManager.FindByNameAsync(loginName);
            await _userManager.AddToRolesAsync(userFetched,  new[] { RolesConstants.GUEST });
            _log.LogDebug($"Created Information for User: {newUser}");

            await CreateDummyData(userFetched);

            var userAuthenticated = await _authenticationService.Authenticate(loginName, password);
            var rememberMe = false;
            var jwt = _tokenProvider.CreateToken(userAuthenticated, rememberMe);
            var httpHeaders = new HeaderDictionary
            {
                [JwtConstants.AuthorizationHeader] = $"{JwtConstants.BearerPrefix} {jwt}"
            };

            return Ok(new JwtToken(jwt)).WithHeaders(httpHeaders);
        }
    }

    class Address {
        public string address { get; set; }
        public string city { get; set; }
        public States state { get; set; }
        public string zipCode { get; set; }
        public string phoneNumber { get; set; }
        public Address(string address, string city, States state, string zipCode, string phoneNumber) {
            this.address = address;
            this.city = city;
            this.state = state;
            this.zipCode = zipCode;
            this.phoneNumber = phoneNumber;
        }
    }

    class Person {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string imagePath { get; set; }
        public Person(string firstName, string lastName, string imagePath) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.imagePath = imagePath;
        }
    }
}
