using Microsoft.AspNetCore.Identity;
using Proyecto_IS.Domain.Entites.Identity;

namespace Proyecto_IS.Infraestructure.Email;
public class IdentityEmailSender : IEmailSender<AppUser>
{
    public Task SendConfirmationLinkAsync(AppUser user, string email, string confirmationLink)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetCodeAsync(AppUser user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetLinkAsync(AppUser user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }
}