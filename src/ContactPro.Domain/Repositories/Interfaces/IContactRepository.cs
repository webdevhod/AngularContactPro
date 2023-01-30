using ContactPro.Domain.Entities;

namespace ContactPro.Domain.Repositories.Interfaces
{
    public interface IContactRepository : IGenericRepository<Contact, long>
    {
    }
}
