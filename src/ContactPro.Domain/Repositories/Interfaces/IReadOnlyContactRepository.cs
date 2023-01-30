
using ContactPro.Domain.Entities;

namespace ContactPro.Domain.Repositories.Interfaces
{

    public interface IReadOnlyContactRepository : IReadOnlyGenericRepository<Contact, long>
    {
    }

}
