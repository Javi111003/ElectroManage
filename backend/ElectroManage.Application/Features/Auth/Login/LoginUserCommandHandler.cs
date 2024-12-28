using ElectroManage.Application.Abstractions.Authentication;
using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Identity.Models;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Identity;
using ElectroManage.WebAPI.Models;
using Microsoft.AspNetCore.Identity;
using System.Linq.Expressions;
using User = ElectroManage.Domain.Entites.Identity.AppUser;

namespace ElectroManage.Application.Features.Auth.Login;
public class LoginUserCommandHandler : CoreCommandHandler<LoginModel, LoginUserResponse>
{
    readonly ITokenHandler _tokenHandler;
    readonly UserManager<User> _userManager;
    readonly RoleManager<AppRole> _roleManager;
    public LoginUserCommandHandler(ITokenHandler tokenHandler, UserManager<User> userManager, RoleManager<AppRole> roleManager, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _tokenHandler = tokenHandler;
        _userManager = userManager;
        _roleManager = roleManager;
    }
    public override async Task<LoginUserResponse> ExecuteAsync(LoginModel command, CancellationToken ct = default)
    {
        User appUser = null;
        var userRepository = UnitOfWork!.DbRepository<User>();
        var include = new List<Expression<Func<User, object>>>
        {
            x => x.Company
        };
        if (command.Email != null)
        {
            appUser = await userRepository.FirstAsync(filters: x => x.Email == command.Email, includes: include);
        }
        if (appUser is null || appUser.StatusBaseEntity != Domain.Enums.StatusEntityType.Active || !(await _userManager.CheckPasswordAsync(appUser, command.Password)))
        {
            ThrowError("Invalid user or password");
        }
        var roles = await _userManager.GetRolesAsync(appUser);
        AccessToken accessToken = await _tokenHandler.CreateTokenAsync(appUser);
        return new LoginUserResponse
        {
            Id = appUser.Id,
            Email = appUser.Email!,
            Company = new CompanyDTO
            {
                Id = appUser.Company.Id,
                Name = appUser.Company.Name
            },
            Roles = roles,
            AccessToken = accessToken
        };
    }
}