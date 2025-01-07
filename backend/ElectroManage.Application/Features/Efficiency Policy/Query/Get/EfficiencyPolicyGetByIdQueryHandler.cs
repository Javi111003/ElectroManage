
using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Get;

public class EfficiencyPolicyGetByIdQueryHandler : CoreQueryHandler<EfficiencyPolicyGetByIdQuery, EfficiencyPolicyDTO>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EfficiencyPolicyGetByIdQueryHandler> _logger;

    public EfficiencyPolicyGetByIdQueryHandler(IUnitOfWork unitOfWork, ILogger<EfficiencyPolicyGetByIdQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<EfficiencyPolicyDTO> ExecuteAsync(EfficiencyPolicyGetByIdQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var efficiencyPolicyReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.EfficiencyPolicy, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var efficiencyPolicy = await efficiencyPolicyReporitory.FirstAsync(useInactive: true, filters: filter);
        if (efficiencyPolicy is null)
        {
            _logger.LogError("Efficiency Policy not found");
            ThrowError("Efficiency Policy not found", 404);
        }

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return EfficiencyPolicyMapper.MapToEfficiencyPolicyDTO(efficiencyPolicy);
    }
}
