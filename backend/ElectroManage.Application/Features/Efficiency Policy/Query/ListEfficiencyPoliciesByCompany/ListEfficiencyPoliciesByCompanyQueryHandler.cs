using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.ListEfficiencyPoliciesByCompany;

public class ListEfficiencyPoliciesByCompanyQueryHandler : CoreQueryHandler<ListEfficiencyPoliciesByCompanyQuery, IEnumerable<EfficiencyPolicyDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListEfficiencyPoliciesByCompanyQueryHandler> _logger;

    public ListEfficiencyPoliciesByCompanyQueryHandler(IUnitOfWork unitOfWork, ILogger<ListEfficiencyPoliciesByCompanyQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<EfficiencyPolicyDTO>> ExecuteAsync(ListEfficiencyPoliciesByCompanyQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var companyInclude = new List<Expression<Func<Domain.Entites.Sucursal.Company,object>>>
        {
            x => x.EfficiencyPolicies,
        };
        var company = await companyRepository.FirstAsync(useInactive: true, includes: companyInclude, filters: x => x.Id == command.CompanyId);
        if (company is null)
        {
            _logger.LogError($"The company with id {command.CompanyId} doesn't exist");
            ThrowError($"The company with id {command.CompanyId} doesn't exist", 404);
        }
        
        var policies = company.EfficiencyPolicies.Select(x => EfficiencyPolicyMapper.MapToEfficiencyPolicyDTO(x)).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return policies;
    }
}