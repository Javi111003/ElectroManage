using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.ListAll;

public class ListEfficiencyPoliciesQueryHandler : CoreQueryHandler<ListEfficiencyPoliciesQuery, IEnumerable<EfficiencyPolicyDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListEfficiencyPoliciesQueryHandler> _logger;

    public ListEfficiencyPoliciesQueryHandler(IUnitOfWork unitOfWork, ILogger<ListEfficiencyPoliciesQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<EfficiencyPolicyDTO>> ExecuteAsync(ListEfficiencyPoliciesQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var policiesRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        var policies = await policiesRepository.GetAll(useInactive: true)
            .ToListAsync();
        var policiesDtos = policies.Select(x => EfficiencyPolicyMapper.MapToEfficiencyPolicyDTO(x)).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return policiesDtos;
    }
}