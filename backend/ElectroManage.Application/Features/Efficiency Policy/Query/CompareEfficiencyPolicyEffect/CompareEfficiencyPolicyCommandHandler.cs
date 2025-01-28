using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.CompareEfficiencyPolicyEffect;

public class CompareEfficiencyPolicyEffectCommandHandler : CoreCommandHandler<CompareEfficiencyPolicyEffectQuery, CompareEfficiencyPolicyEffectResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CompareEfficiencyPolicyEffectCommandHandler> _logger;

    public CompareEfficiencyPolicyEffectCommandHandler(IUnitOfWork unitOfWork, ILogger<CompareEfficiencyPolicyEffectCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CompareEfficiencyPolicyEffectResponse> ExecuteAsync(CompareEfficiencyPolicyEffectQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var efficiencyPolicyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            c => c.Registers,
            c => c.EfficiencyPoliciesApplyed
        };
        
        var company = await companyRepository.FirstAsync(includes: include, filters: c => c.Id == command.CompanyId);
        if (company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with Id {command.CompanyId} not found");
            ThrowError($"Company with Id {command.CompanyId} not found", 404);
        }

        var policy = await efficiencyPolicyRepository.FirstAsync(filters: x => x.Id == command.EfficiencyPolicyId);
        if (policy == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Efficiency Policy with Id {command.EfficiencyPolicyId} not found");
            ThrowError($"Efficiency Policy with Id {command.EfficiencyPolicyId} not found", 404);
        }

        var appliedPolicy = company.EfficiencyPoliciesApplyed.Last(x => x.EfficiencyPolicyId == command.EfficiencyPolicyId);

        var start = appliedPolicy.ApplyingDate.Date;
        var end = appliedPolicy.To?.Date ?? DateTime.UtcNow.Date;     // in case the policy is currently active we use the current date as end date
        TimeSpan timeSpan = start - end ;
        DateTime startBeforePeriod = start - timeSpan;

        var registersBefore = company.Registers.Where(r => r.Date.Date >= startBeforePeriod && r.Date.Date <= start && r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active)
            .Select(RegisterMapper.MapToRegisterDto)
            .OrderByDescending(r => r.Date);

        var registersAfter = company.Registers.Where(r => r.Date.Date <= end && r.Date.Date >= start && r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active)
            .Select(RegisterMapper.MapToRegisterDto)
            .OrderByDescending(r => r.Date);
        
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new CompareEfficiencyPolicyEffectResponse
        {
            Before = RegisterMapper.MapToListRegisterResponse(registersBefore),
            After = RegisterMapper.MapToListRegisterResponse(registersAfter)
        };
    }
}