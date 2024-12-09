
using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Post;

public class CreateEfficiencyPolicyCommandHandler : CoreCommandHandler<CreateEfficienciPolicyCommand, CreateEfficiencyPolicyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateEfficiencyPolicyCommandHandler> _logger;
    ICheckUniqueService _checkUniqueService;

    public CreateEfficiencyPolicyCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateEfficiencyPolicyCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
    }

    public async override Task<CreateEfficiencyPolicyResponse> ExecuteAsync(CreateEfficienciPolicyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var efficiencyPoliciesReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();

        var efficiencyPolicy = new EfficiencyPolicy
        {
            Name = command.Name,
            Description = command.Description,
        };

        var checkUniqueName = await _checkUniqueService.CheckUniqueNameAsync(efficiencyPolicy);
        if (!checkUniqueName)
        {
            _logger.LogError("This efficiency policies name already exists");
            ThrowError("This efficiency policies name already exists", 404);
        }

        await efficiencyPoliciesReporitory.SaveAsync(efficiencyPolicy, false);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        await UnitOfWork!.SaveChangesAsync();
        return new CreateEfficiencyPolicyResponse
        {
            Id = efficiencyPolicy.Id,
            Name = efficiencyPolicy.Name,
            Description = efficiencyPolicy.Description,
        };
    }
}
