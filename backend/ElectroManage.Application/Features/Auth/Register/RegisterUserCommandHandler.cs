using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Identity;
using ElectroManage.WebAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using User = ElectroManage.Domain.Entites.Identity.AppUser;

namespace ElectroManage.Application.Features.Auth.Register;
public class RegisterUserCommandHandler : CoreCommandHandler<RegisterModel, Response<NoContentData>>
{
    readonly ILogger<RegisterUserCommandHandler> _logger;
    readonly RoleManager<AppRole> _roleManager;
    readonly UserManager<User> _userManager;
    readonly IConfiguration _configuration;
    public RegisterUserCommandHandler(ILogger<RegisterUserCommandHandler> logger, RoleManager<AppRole> roleManager, UserManager<User> userManager, IConfiguration configuration, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _roleManager = roleManager;
        _userManager = userManager;
        _configuration = configuration;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(RegisterModel command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
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
            UserName = command.Email,
            Company = company
        };
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
        var allowedRoles = _configuration["AllowedRoles"].Split(',').ToList();
        var nonExistantRoles = command.Roles.Except(allowedRoles);
        foreach(var role in nonExistantRoles)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Role \"{role}\" not found");
            AddError($"Role with id : \"{role}\" not found");
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
            var addToRoleResult = await _userManager.AddToRoleAsync(appUser, rol);
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