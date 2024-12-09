using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.ManagementTeam.Query.GetTeamByCompany;
public class GetTeamByCompanyQueryHandler : CoreQueryHandler<GetTeamByCompanyQuery, GetTeamByCompanyResponse>
{
    readonly ILogger<GetTeamByCompanyQueryHandler> _logger;
    public GetTeamByCompanyQueryHandler(ILogger<GetTeamByCompanyQueryHandler> logger, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<GetTeamByCompanyResponse> ExecuteAsync(GetTeamByCompanyQuery query, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.ManagementTeam,
            x => x.ManagementTeam.Members
        };
        var company = await companyRepository.FirstAsync(useInactive: true, filters: x => x.Id == query.CompanyId, includes: include);
        if (company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {query.CompanyId} does not exist");
            ThrowError($"Company with id {query.CompanyId} does not exist");
        }
        var team = company.ManagementTeam;
        if (team == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {query.CompanyId} does not have a management team");
            ThrowError($"Company with id {query.CompanyId} does not have a management team");
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        var response = Mappers.ManagementTeamMapper.MapToGetTeamResponse(team);
        return response;
    }
}