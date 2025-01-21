using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.ManagementTeam.Command.CreateTeam;
public class CreateTeamCommandHandler : CoreCommandHandler<CreateTeamCommand, ManagementTeamDto>
{
    readonly ILogger<CreateTeamCommandHandler> _logger;
    public CreateTeamCommandHandler(ILogger<CreateTeamCommandHandler> logger, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<ManagementTeamDto> ExecuteAsync(CreateTeamCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var teamRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.ManagementTeam>();
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var usersRepository = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Workers,
            x => x.ManagementTeam
        };
        var company = await companyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.CompanyId, includes: include);
        if(company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {command.CompanyId} does not exists");
            ThrowError($"Company with id {command.CompanyId} does not exists");
        }
        var members = await usersRepository.GetAll(filters: u => command.UserIds.Contains(u.Id) && u.CompanyId == company.Id).ToListAsync();
        var notExistantUsers = command.UserIds.Except(members.Select(u => u.Id).ToList());
        foreach (var id in notExistantUsers)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id {id} does not exists or was'nt part of Company");
            AddError($"User with id {id} does not exists or was'nt part of Company");
        }
        ThrowIfAnyErrors(statusCode:404);
        if(company.ManagementTeam != null)
        {
             await teamRepository.DeleteAsync(team);
        }
        var team = new Domain.Entites.Sucursal.ManagementTeam
        {
            Name = command.Name,
            Members = members,
            Company = company
        };
        await teamRepository.SaveAsync(team,false);
        foreach (var member in members)
        {
            member.ManagementTeam = team;
            usersRepository.Update(member,false);
        }
        company.ManagementTeam = team;
        await companyRepository.UpdateAsync(company,false);
        await UnitOfWork!.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        var response = Mappers.ManagementTeamMapper.MapToManagementTeamDto(team);
        return response;
    }
}
