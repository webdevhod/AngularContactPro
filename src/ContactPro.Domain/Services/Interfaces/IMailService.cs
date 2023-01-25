using System.Threading.Tasks;
using ContactPro.Domain.Entities;

namespace ContactPro.Domain.Services.Interfaces;

public interface IMailService
{
    Task SendPasswordResetMail(User user);
    Task SendActivationEmail(User user);
    Task SendCreationEmail(User user);
}
