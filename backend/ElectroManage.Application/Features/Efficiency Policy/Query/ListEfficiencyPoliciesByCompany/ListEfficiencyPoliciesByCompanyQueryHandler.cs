using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.ListEfficiencyPoliciesByCompany;

public class ListEfficiencyPoliciesByCompanyQueryHandler : CoreQueryHandler<ListEfficiencyPoliciesByCompanyQuery, IEnumerable<AppliedEfficiencyPolicyDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListEfficiencyPoliciesByCompanyQueryHandler> _logger;

    public ListEfficiencyPoliciesByCompanyQueryHandler(IUnitOfWork unitOfWork, ILogger<ListEfficiencyPoliciesByCompanyQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<AppliedEfficiencyPolicyDTO>> ExecuteAsync(ListEfficiencyPoliciesByCompanyQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        
        var company = await companyRepository.GetAll(useInactive: true, filters: x => x.Id == command.CompanyId)
            .Include(x => x.EfficiencyPoliciesApplyed)
            .ThenInclude(x => x.EfficiencyPolicy).FirstOrDefaultAsync();

        if (company is null)
        {
            _logger.LogError($"The company with id {command.CompanyId} doesn't exist");
            ThrowError($"The company with id {command.CompanyId} doesn't exist", 404);
        }
        
        var policies = company.EfficiencyPoliciesApplyed.Select(x => EfficiencyPolicyMapper.MapToAppliedEfficiencyPolicyDTO(x)).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return policies;
    }
}