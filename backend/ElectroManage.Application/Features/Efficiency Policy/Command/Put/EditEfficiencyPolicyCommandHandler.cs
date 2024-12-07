
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Put;

public class EditEfficiencyPolicyCommandHandler : CoreCommandHandler<EditEfficiencyPolicyCommand, EditEfficiencyPolicyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditEfficiencyPolicyCommandHandler> _logger;

    public EditEfficiencyPolicyCommandHandler(IUnitOfWork unitOfWork, ILogger<EditEfficiencyPolicyCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EditEfficiencyPolicyResponse> ExecuteAsync(EditEfficiencyPolicyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var efficiencyPolicyReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.EfficiencyPolicy, bool>>[]
        {
            x => x.Id == command.Id
        };
        var efficiencyPolicy = await efficiencyPolicyReporitory.FirstAsync(useInactive: true, filters: filter);
        if (efficiencyPolicy is null)
        {
            _logger.LogError("Efficiency Policy not found");
            ThrowError("Efficiency Policy not found", 404);
        }

        var checkUniqueName = await efficiencyPolicyReporitory.CountAsync(useInactive: true, filters: x => x.Name == command.Name && x.Id != command.Id);
        if (checkUniqueName > 0)
        {
            _logger.LogError("This Policy's name already exists");
            ThrowError("This Policy's name already exists", 404);
        }

        efficiencyPolicy.Name = command.Name;
        efficiencyPolicy.Description = command.Description;

        await efficiencyPolicyReporitory.UpdateAsync(efficiencyPolicy);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new EditEfficiencyPolicyResponse
        {
            Id = efficiencyPolicy.Id,
            Name = efficiencyPolicy.Name,
            Description = efficiencyPolicy.Description,
        };
    }
}
