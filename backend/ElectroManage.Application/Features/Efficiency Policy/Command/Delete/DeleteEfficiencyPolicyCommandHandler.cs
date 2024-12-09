using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Delete;

public class DeleteEfficiencyPolicyCommandHandler : CoreCommandHandler<DeleteEfficiencyPolicyCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteEfficiencyPolicyCommandHandler> _logger;

    public DeleteEfficiencyPolicyCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteEfficiencyPolicyCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteEfficiencyPolicyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var efficiencyPolicyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        var efficiencyPolicy = await efficiencyPolicyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if (efficiencyPolicy is null)
        {
            _logger.LogError($"Efficiency Policy with id: {command.Id} not found");
            ThrowError($"Efficiency Policy with id: {command.Id} not found", 404);
        }
        efficiencyPolicy.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await efficiencyPolicyRepository.UpdateAsync(efficiencyPolicy, false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
