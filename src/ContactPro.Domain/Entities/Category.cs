using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace ContactPro.Domain.Entities
{
    [Table("category")]
    public class Category : BaseEntity<long>
    {
        [Required]
        public string Name { get; set; }
        public DateTime? Created { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public virtual ICollection<Contact> Contacts { get; set; } = new HashSet<Contact>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var category = obj as Category;
            if (category?.Id == null || category?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, category.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Category{" +
                    $"ID='{Id}'" +
                    $", Name='{Name}'" +
                    $", Created='{Created}'" +
                    "}";
        }
    }
}
