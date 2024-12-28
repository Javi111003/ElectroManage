using ElectroManage.Application.Abstractions.Authentication;
using ElectroManage.Application.Identity.Models;
using ElectroManage.Domain.Entites.Identity;
using ElectroManage.WebAPI.Models;
using Microsoft.AspNetCore.Identity;
using User = ElectroManage.Domain.Entites.Identity.AppUser;

namespace ElectroManage.Application.Features.Auth.Login;
public class LoginUserCommandHandler : CoreCommandHandler<LoginModel, LoginUserResponse>
{
    readonly ITokenHandler _tokenHandler;
    readonly UserManager<User> _userManager;
    readonly RoleManager<AppRole> _roleManager;
    public LoginUserCommandHandler(ITokenHandler tokenHandler, UserManager<User> userManager, RoleManager<AppRole> roleManager)
    {
        _tokenHandler = tokenHandler;
        _userManager = userManager;
        _roleManager = roleManager;
    }
    public override async Task<LoginUserResponse> ExecuteAsync(LoginModel command, CancellationToken ct = default)
    {
        User appUser = null;
        if (command.Email != null)
        {
            appUser = await _userManager.FindByEmailAsync(command.Email);
        }
        if (appUser is null || appUser.StatusBaseEntity != Domain.Enums.StatusEntityType.Active || !(await _userManager.CheckPasswordAsync(appUser, command.Password)))
        {
            ThrowError("Invalid user or password");
        }
        AccessToken accessToken = await _tokenHandler.CreateTokenAsync(appUser);
        return new LoginUserResponse
        {
            AccessToken = accessToken
        };
    }
}