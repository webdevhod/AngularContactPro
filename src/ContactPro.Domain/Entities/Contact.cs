using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ContactPro.Crosscutting.Enums;
using Newtonsoft.Json;

namespace ContactPro.Domain.Entities
{
    [Table("contact")]
    public class Contact : BaseEntity<long>
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string FullName { get { return $"{FirstName} {LastName}"; } }
        public string Tag { get { return $"{FullName} <{Email}>"; } }
        [Required]
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public States State { get; set; }
        [Required]
        public string ZipCode { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime? Created { get; set; }
        public byte[] ImageData { get; set; }
        public string ImageType { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public virtual ICollection<Category> Categories { get; set; } = new HashSet<Category>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var contact = obj as Contact;
            if (contact?.Id == null || contact?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, contact.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Contact{" +
                    $"ID='{Id}'" +
                    $", FirstName='{FirstName}'" +
                    $", LastName='{LastName}'" +
                    $", Address1='{Address1}'" +
                    $", Address2='{Address2}'" +
                    $", City='{City}'" +
                    $", State='{State}'" +
                    $", ZipCode='{ZipCode}'" +
                    $", Email='{Email}'" +
                    $", PhoneNumber='{PhoneNumber}'" +
                    $", BirthDate='{BirthDate}'" +
                    $", Created='{Created}'" +
                    $", ImageData='{ImageData}'" +
                    $", ImageType='{ImageType}'" +
                    "}";
        }
    }
}
