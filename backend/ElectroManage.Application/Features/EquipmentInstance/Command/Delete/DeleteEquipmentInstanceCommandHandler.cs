using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentInstance.Command.Delete;
public class DeleteEquipmentInstanceCommandHandler : CoreCommandHandler<DeleteEquipmentInstanceCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteEquipmentInstanceCommandHandler> _logger;
    public DeleteEquipmentInstanceCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteEquipmentInstanceCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }
    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteEquipmentInstanceCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var equipmentInstanceRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentInstance>();
        var equipmentInstance = await equipmentInstanceRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if (equipmentInstance is null)
        {
            _logger.LogError($"Equipment Instance with id: {command.Id} not found");
            ThrowError($"Equipment Instance with id: {command.Id} not found", 404);
        }
        equipmentInstance.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await equipmentInstanceRepository.UpdateAsync(equipmentInstance,false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}