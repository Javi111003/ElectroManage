using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.ManagementTeam.Command.DeleteTeam;
public class DeleteTeamCommandHandler : CoreCommandHandler<DeleteTeamCommand, DeleteTeamResponse>
{
    readonly ILogger<DeleteTeamCommandHandler> _logger;
    public DeleteTeamCommandHandler(ILogger<DeleteTeamCommandHandler> logger, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<DeleteTeamResponse> ExecuteAsync(DeleteTeamCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var teamRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.ManagementTeam>();
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var usersRepository = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.ManagementTeam, object>>>
        {
            x => x.Members
        };
        var team = await teamRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.TeamId && x.Company.Id == command.CompanyId, includes: include);
        if (team == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Team with id {command.TeamId} does not exist in the specified company");
            ThrowError($"Team with id {command.TeamId} does not exist in the specified company");
        }

        var company = await companyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.CompanyId);
        if (company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {command.CompanyId} does not exist");
            ThrowError($"Company with id {command.CompanyId} does not exist");
        }

        foreach (var member in team.Members)
        {
            member.ManagementTeam = null;
            await usersRepository.UpdateAsync(member, false);
        }

        company.ManagementTeam = null;
        await companyRepository.UpdateAsync(company, false);
        await teamRepository.DeleteAsync(team, false);
        await UnitOfWork!.SaveChangesAsync();

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        var response = new DeleteTeamResponse { Success = true };
        return response;
    }
}