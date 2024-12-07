
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Post;

public class CreateEfficiencyPolicyCommandHandler : CoreCommandHandler<CreateEfficienciPolicyCommand, CreateEfficiencyPolicyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateEfficiencyPolicyCommandHandler> _logger;

    public CreateEfficiencyPolicyCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateEfficiencyPolicyCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateEfficiencyPolicyResponse> ExecuteAsync(CreateEfficienciPolicyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var efficiencyPoliciesReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        var checkUniqueName = await efficiencyPoliciesReporitory.CountAsync(useInactive: true, filters: x => x.Name == command.Name);
        if (checkUniqueName > 0)
        {
            _logger.LogError("This efficiency policies name already exists");
            ThrowError("This efficiency policies name already exists", 404);
        }

        var efficiencyPolicy = new EfficiencyPolicy
        {
            Name = command.Name,
            Description = command.Description,
        };

        await efficiencyPoliciesReporitory.SaveAsync(efficiencyPolicy);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new CreateEfficiencyPolicyResponse
        {
            Id = efficiencyPolicy.Id,
            Name = efficiencyPolicy.Name,
            Description = efficiencyPolicy.Description,
        };
    }
}
