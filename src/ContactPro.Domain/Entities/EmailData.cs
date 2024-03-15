using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContactPro.Domain.Entities
{
    [Table("email_data")]
    public class EmailData : BaseEntity<long>
    {
        [Required]
        public string Subject { get; set; }
        [Required]
        public string Message { get; set; }
        [Required]
        public ICollection<Contact> Contacts { get; set; } = new HashSet<Contact>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "EmailData{" +
                    $", Subject='{Subject}'" +
                    $", Message='{Message}'" +
                    $", Emails='{string.Join(", ", Contacts)}'" +
                    "}";
        }
    }
}
