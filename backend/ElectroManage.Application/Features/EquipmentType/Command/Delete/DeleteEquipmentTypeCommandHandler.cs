using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentType.Command.Delete;

public class DeleteEquipmentTypeCommandHandler : CoreCommandHandler<DeleteEquipmentTypeCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteEquipmentTypeCommandHandler> _logger;
    public DeleteEquipmentTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteEquipmentTypeCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }
    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteEquipmentTypeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var equipmentTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentType>();
        var equipmentType = await equipmentTypeRepository.FirstAsync(useInactive: true, filters: x=>x.Id == command.Id);
        if (equipmentType is null)
        {
            _logger.LogError($"Equipment Type with id: {command.Id} not found");
            ThrowError($"Equipment Type with id: {command.Id} not found", 404);
        }
        equipmentType.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await equipmentTypeRepository.UpdateAsync(equipmentType, false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}