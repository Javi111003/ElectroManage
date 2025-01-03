using ElectroManage.Application.Abstractions;
using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Roles.Command.Delete;
public class DeleteRoleCommandHandler : CoreCommandHandler<DeleteRoleCommand, Response<NoContentData>>
{
    readonly ILogger<DeleteRoleCommandHandler> _logger;
    readonly RoleManager<AppRole> _roleManager;
    readonly IConfiguration _configuration;
    readonly IFileWriterService _fileWriter;
    public DeleteRoleCommandHandler(ILogger<DeleteRoleCommandHandler> logger, RoleManager<AppRole> roleManager, IFileWriterService fileWriter ,IConfiguration configuration, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _roleManager = roleManager;
        _configuration = configuration;
        _fileWriter = fileWriter;
    }
    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteRoleCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var roleRepository = UnitOfWork!.DbRepository<AppRole>();
        var role = await roleRepository.GetByIdAsync(useInactive: true , id: command.Id);
        if (role == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Role with id : {command.Id} not found");
            ThrowError($"Role with id : {command.Id} not found", 404);
        }
        var resultRole = await _roleManager.DeleteAsync(role);
        if (!resultRole.Succeeded)
        {
            foreach (var error in resultRole.Errors)
            {
                _logger.LogWarning($"{nameof(ExecuteAsync)} | Error creating new role -> {error.Description}");
                AddError(error.Description);
            }
            ThrowIfAnyErrors(404);
        }
        _fileWriter.UpdateAllowedRoles(role.Name!, true);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new Response<NoContentData>();
    }
}