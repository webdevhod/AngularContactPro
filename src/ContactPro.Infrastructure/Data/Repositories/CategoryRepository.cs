using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JHipsterNet.Core.Pagination;
using JHipsterNet.Core.Pagination.Extensions;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Infrastructure.Data.Extensions;

namespace ContactPro.Infrastructure.Data.Repositories
{
    public class CategoryRepository : GenericRepository<Category, long>, ICategoryRepository
    {
        public CategoryRepository(IUnitOfWork context) : base(context)
        {
        }

        public override async Task<Category> CreateOrUpdateAsync(Category category)
        {
            List<Type> entitiesToBeUpdated = new List<Type>();

            await RemoveManyToManyRelationship("CategoryContacts", "CategoriesId", "ContactsId", category.Id, category.Contacts.Select(x => x.Id).ToList());
            entitiesToBeUpdated.Add(typeof(Contact));
            return await base.CreateOrUpdateAsync(category, entitiesToBeUpdated);
        }
    }
}
