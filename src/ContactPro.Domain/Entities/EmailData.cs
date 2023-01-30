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
        public string Body { get; set; }
        [Required]
        public ICollection<Contact> Contacts { get; set; } = new HashSet<Contact>();
        [Required]
        public bool IsCategory { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var emailData = obj as EmailData;
            if (emailData?.Id == null || emailData?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, emailData.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "EmailData{" +
                    $"ID='{Id}'" +
                    $", Subject='{Subject}'" +
                    $", Body='{Body}'" +
                    $", Emails='{string.Join(", ", Contacts)}'" +
                    $", IsCategory='{IsCategory}'" +
                    "}";
        }
    }
}
