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
    public class ContactRepository : GenericRepository<Contact, long>, IContactRepository
    {
        public ContactRepository(IUnitOfWork context) : base(context)
        {
        }

        public override async Task<Contact> CreateOrUpdateAsync(Contact contact)
        {
            List<Type> entitiesToBeUpdated = new List<Type>();
            return await base.CreateOrUpdateAsync(contact, entitiesToBeUpdated);
        }
    }
}
