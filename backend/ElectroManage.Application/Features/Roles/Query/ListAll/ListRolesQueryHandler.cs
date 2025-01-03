using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Roles.Query.ListAll;

public class ListRolesQueryHandler : CoreQueryHandler<ListRolesQuery, IEnumerable<RoleInfoDto>>
{
    readonly ILogger<ListRolesQueryHandler> _logger;
    public ListRolesQueryHandler(ILogger<ListRolesQueryHandler> logger, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<IEnumerable<RoleInfoDto>> ExecuteAsync(ListRolesQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var rolesRepository = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppRole>();
        var roles = await rolesRepository.GetAll(useInactive: true)
            .ToListAsync();
        var roleDtos = roles.Select(r => new RoleInfoDto
        {
            Id = r.Id,
            Name = r.Name ?? ""
        }).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return roleDtos;
    }
}