using System.Security.Principal;
using System.Threading.Tasks;

namespace ContactPro.Domain.Services.Interfaces;

public interface IAuthenticationService
{
    Task<IPrincipal> Authenticate(string username, string password);
}
