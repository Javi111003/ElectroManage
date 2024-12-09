using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentBrand.Command.Delete;

public class DeleteEquipmentBrandCommandHandler : CoreCommandHandler<DeleteEquipmentBrandCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteEquipmentBrandCommandHandler> _logger;

    public DeleteEquipmentBrandCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteEquipmentBrandCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteEquipmentBrandCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var equipmentBrandRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentBrand>();
        var equipmentBrand = await equipmentBrandRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if (equipmentBrand is null)
        {
            _logger.LogError($"Equipment Brand with id: {command.Id} not found");
            ThrowError($"Equipment Brand with id: {command.Id} not found", 404);
        }
        equipmentBrand.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await equipmentBrandRepository.UpdateAsync(equipmentBrand);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
