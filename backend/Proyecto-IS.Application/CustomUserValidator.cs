using Microsoft.AspNetCore.Identity;
using Proyecto_IS.Domain.Entites.Identity;

namespace Proyecto_IS.Application;
public class CustomUserValidator<TUser> : UserValidator<TUser> where TUser : AppUser
{
    public async override Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user)
    {
        var result = await base.ValidateAsync(manager, user);

        if (string.IsNullOrWhiteSpace(user.UserName))
        {
            return IdentityResult.Success;
        }

        return result;
    }
}