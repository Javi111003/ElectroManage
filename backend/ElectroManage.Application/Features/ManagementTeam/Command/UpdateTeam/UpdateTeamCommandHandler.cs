using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.ManagementTeam.Command.UpdateTeam;
public class UpdateTeamCommandHandler : CoreCommandHandler<UpdateTeamCommand, ManagementTeamDto>
{
    readonly ILogger<UpdateTeamCommandHandler> _logger;
    public UpdateTeamCommandHandler(ILogger<UpdateTeamCommandHandler> logger, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<ManagementTeamDto> ExecuteAsync(UpdateTeamCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var teamRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.ManagementTeam>();
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var usersRepository = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.ManagementTeam, object>>>
        {
            x => x.Members,
            x => x.Company
        };
        var team = await teamRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.TeamId,includes: include);
        if (team == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Team with id {command.TeamId} does not exist in the specified company");
            ThrowError($"Team with id {command.TeamId} does not exist in the specified company");
        }
        var members = await usersRepository.GetAll(filters: u => command.UserIds.Contains(u.Id) && u.CompanyId == team.CompanyId).ToListAsync();
        var notExistantUsers = command.UserIds.Except(members.Select(u => u.Id).ToList());
        foreach (var id in notExistantUsers)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id {id} does not exist or wasn't part of Company");
            AddError($"User with id {id} does not exist or wasn't part of Company");
        }
        ThrowIfAnyErrors(statusCode: 404);
        team.Name = command.Name;
        team.Members = members;
        await teamRepository.UpdateAsync(team, false);
        foreach (var member in members)
        {
            member.ManagementTeam = team;
            usersRepository.Update(member, false);
        }
        await UnitOfWork!.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        var response = Mappers.ManagementTeamMapper.MapToManagementTeamDto(team);
        return response;
    }
}