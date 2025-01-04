using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

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
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();
        var officeInclude = new List<Expression<Func<Domain.Entites.Offices.Office, object>>>
        {
            x => x.Equipments
        };
        var equipmentInstanceRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentInstance>();
        var equipmentInstance = await equipmentInstanceRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if (equipmentInstance is null)
        {
            _logger.LogError($"Equipment Instance with id: {command.Id} not found");
            ThrowError($"Equipment Instance with id: {command.Id} not found", 404);
        }
        var office = await officeRepository.FirstAsync(useInactive: true, officeInclude, x => x.Id == equipmentInstance.OfficeId);
        if (office is null)
        {
            _logger.LogError($"Office with id : {equipmentInstance.OfficeId} associated to Equipment Instance with id: {command.Id}, not found");
            ThrowError($"Office with id {equipmentInstance.OfficeId} associated to Equipment Instance with id: {command.Id} ,not found", 404);
        }
        office.Equipments.Remove(equipmentInstance);
        equipmentInstance.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await officeRepository.UpdateAsync(office, false);
        await equipmentInstanceRepository.UpdateAsync(equipmentInstance,false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
