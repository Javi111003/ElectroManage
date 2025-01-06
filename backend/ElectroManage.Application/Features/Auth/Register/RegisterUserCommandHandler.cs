using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Identity;
using ElectroManage.WebAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using User = ElectroManage.Domain.Entites.Identity.AppUser;

namespace ElectroManage.Application.Features.Auth.Register;
public class RegisterUserCommandHandler : CoreCommandHandler<RegisterModel, Response<NoContentData>>
{
    readonly ILogger<RegisterUserCommandHandler> _logger;
    readonly RoleManager<AppRole> _roleManager;
    readonly UserManager<User> _userManager;
    public RegisterUserCommandHandler(ILogger<RegisterUserCommandHandler> logger, RoleManager<AppRole> roleManager, UserManager<User> userManager, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _roleManager = roleManager;
        _userManager = userManager;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(RegisterModel command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var roleRepository = UnitOfWork!.DbRepository<AppRole>();
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var company = await companyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.CompanyId);
        if(company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id : {command.CompanyId} not found");
            ThrowError($"Company with id : {command.CompanyId} not found", 404);
        }
        var appUser = new User
        {
            Email = command.Email,
            UserName = command.Username != null ? command.Username : "",
            Company = company
        };
        var allowedRoles = await roleRepository.GetAllListOnly(useInactive: true).Select(r => r.Name).ToListAsync();
        var nonExistantRoles = command.Roles.Except(allowedRoles, StringComparer.InvariantCultureIgnoreCase);
        foreach(var role in nonExistantRoles)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Role: \"{role}\" not found");
            AddError($"Role with name : \"{role}\" not found");
        }
        ThrowIfAnyErrors(404);
        foreach (var rol in command.Roles)
        {
            if (!await _roleManager.RoleExistsAsync(rol))
            {
                var newRole = new AppRole { Name = rol };
                var resultRole = await _roleManager.CreateAsync(newRole);
                if (!resultRole.Succeeded)
                {
                    foreach (var error in resultRole.Errors)
                    {
                        _logger.LogWarning($"{nameof(ExecuteAsync)} | Error creating new role -> {error.Description}");
                        AddError(error.Description);
                    }
                    ThrowIfAnyErrors();
                }
            }
        }
        var result = await _userManager.CreateAsync(appUser, command.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                _logger.LogWarning($"{nameof(ExecuteAsync)} | Error creating new account -> {error.Description}");
                AddError(error.Description);
            }
            ThrowIfAnyErrors();
        }
        foreach (var role in command.Roles)
        {
            var addToRoleResult = await _userManager.AddToRoleAsync(appUser, role);
            if (!addToRoleResult.Succeeded)
            {
                foreach (var error in addToRoleResult.Errors)
                {
                    _logger.LogWarning($"{nameof(ExecuteAsync)} | Error assigning role -> {error.Description}");
                    AddError(error.Description);
                }
                ThrowIfAnyErrors();
            }
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new Response<NoContentData>();
    }
}