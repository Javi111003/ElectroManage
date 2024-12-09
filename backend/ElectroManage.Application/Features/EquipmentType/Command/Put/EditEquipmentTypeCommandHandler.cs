using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentType.Command.Put;

public class EditEquipmentTypeCommandHandler : CoreCommandHandler<EditEquipmentTypeCommand, EditEquipmentTypeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditEquipmentTypeCommandHandler> _logger;

    public EditEquipmentTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<EditEquipmentTypeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EditEquipmentTypeResponse> ExecuteAsync(EditEquipmentTypeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentType>();
        var filter = new Expression<Func<Domain.Entites.Equipment.EquipmentType, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var equipmentType = await equipmentTypeRepository.FirstAsync(useInactive: true, filters: filter);
        if (equipmentType is null)
        {
            _logger.LogError($"The equipment type with id {command.Id} doesn't exist");
            ThrowError($"The equipment type with id {command.Id} doesn't exist", 404);
        }

        var checkUniqueName = await equipmentTypeRepository.CountAsync(useInactive: true, filters: x => x.Name == command.Name && x.Id != command.Id);
        if (checkUniqueName > 0)
        {
            _logger.LogError("This equipment type name already exists");
            ThrowError("This equipment type name already exists", 400);
        }

        equipmentType.Name = command.Name;
        equipmentType.Description = command.Description;

        await equipmentTypeRepository.UpdateAsync(equipmentType);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new EditEquipmentTypeResponse
        {
            Id = equipmentType.Id,
            Name = equipmentType.Name,
            Description = equipmentType.Description,
        };
    }
}
