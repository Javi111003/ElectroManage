using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Roles.Command.Post;
public class CreateRoleCommandHandler : CoreCommandHandler<CreateRoleCommand,RoleInfoDto>
{
    readonly ILogger<CreateRoleCommandHandler> _logger;
    readonly RoleManager<AppRole> _roleManager;
    public CreateRoleCommandHandler(ILogger<CreateRoleCommandHandler> logger, RoleManager<AppRole> roleManager, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _roleManager = roleManager;
    }
    public override async Task<RoleInfoDto> ExecuteAsync(CreateRoleCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var roleRepository = UnitOfWork!.DbRepository<AppRole>();
        var allowedRoles = await roleRepository.GetAllListOnly(useInactive: true).Select(r => r.Name).ToListAsync();
        if (allowedRoles.Contains(command.RoleName, StringComparer.InvariantCultureIgnoreCase))
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Already exists a role with Name : {command.RoleName}");
            ThrowError($"Already exists a role with Name: { command.RoleName}");
        }
        var newRole = new AppRole { Name = command.RoleName };
        var resultRole = await _roleManager.CreateAsync(newRole);
        if (!resultRole.Succeeded)
        {
            foreach (var error in resultRole.Errors)
            {
                _logger.LogWarning($"{nameof(ExecuteAsync)} | Error creating new role -> {error.Description}");
                AddError(error.Description);
            }
            ThrowIfAnyErrors(404);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new RoleInfoDto
        {
            Id = newRole.Id,
            Name = newRole.Name
        };
    }
}