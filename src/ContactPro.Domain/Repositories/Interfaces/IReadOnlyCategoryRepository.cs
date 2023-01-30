
using ContactPro.Domain.Entities;

namespace ContactPro.Domain.Repositories.Interfaces
{

    public interface IReadOnlyCategoryRepository : IReadOnlyGenericRepository<Category, long>
    {
    }

}
