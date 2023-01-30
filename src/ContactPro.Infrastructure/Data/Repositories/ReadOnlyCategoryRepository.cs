using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JHipsterNet.Core.Pagination;
using JHipsterNet.Core.Pagination.Extensions;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Infrastructure.Data.Extensions;

namespace ContactPro.Infrastructure.Data.Repositories
{
    public class ReadOnlyCategoryRepository : ReadOnlyGenericRepository<Category, long>, IReadOnlyCategoryRepository
    {
        public ReadOnlyCategoryRepository(IUnitOfWork context) : base(context)
        {
        }
    }
}
