
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Get;

public class EfficiencyPolicyGetByIdCommandHandler : CoreCommandHandler<EfficiencyPolicyGetByIdCommand, EfficiencyPolicyGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EfficiencyPolicyGetByIdCommandHandler> _logger;

    public EfficiencyPolicyGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<EfficiencyPolicyGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<EfficiencyPolicyGetByIdResponse> ExecuteAsync(EfficiencyPolicyGetByIdCommand command, CancellationToken ct = default)
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
        return new EfficiencyPolicyGetByIdResponse
        {
            Id = efficiencyPolicy.Id,
            Name = efficiencyPolicy.Name,
            Description = efficiencyPolicy.Description!,
            Created = efficiencyPolicy.Created,
            ApplyingDate = efficiencyPolicy.ApplyingDate,
        };
    }
}
