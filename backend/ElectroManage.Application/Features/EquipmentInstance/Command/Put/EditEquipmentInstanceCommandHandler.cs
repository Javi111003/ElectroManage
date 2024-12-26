using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Enums.Equipment;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentInstance.Command.Put;

public class EditEquipmentInstanceCommandHandler : CoreCommandHandler<EditEquipmentInstanceCommand, EditEquipmentInstanceResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditEquipmentInstanceCommandHandler> _logger;
    public EditEquipmentInstanceCommandHandler(IUnitOfWork unitOfWork, ILogger<EditEquipmentInstanceCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EditEquipmentInstanceResponse> ExecuteAsync(EditEquipmentInstanceCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentInstanceRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentInstance>();
        var filter = new Expression<Func<Domain.Entites.Equipment.EquipmentInstance, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var equipmentInstance = await equipmentInstanceRepository.FirstAsync(useInactive: true, filters: filter);
        if (equipmentInstance is null)
        {
            _logger.LogError($"The equipment instance with id {command.Id} doesn't exist");
            ThrowError($"The equipment instance with id {command.Id} doesn't exist", 404);
        }

        var equipmentSpecificationRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentSpecification>();
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();

        var equipmentSpecification = await equipmentSpecificationRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.EquipmentSpecificationId);
        if (equipmentSpecification is null)
        {
            _logger.LogError($"Equipment Specification with id: {command.EquipmentSpecificationId} not found");
            ThrowError($"Equipment Specification with id: {command.EquipmentSpecificationId} not found", 404);
        }
        
        var office = await officeRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.OfficeId);
        if (office is null)
        {
            _logger.LogError($"Office with id: {command.OfficeId} not found");
            ThrowError($"Office with id: {command.OfficeId} not found", 404);
        }

        if(!Enum.TryParse(command.MantainceStatus, ignoreCase: true, out MaintenanceStatus maintenance))
        {
            _logger.LogError($"{command.MantainceStatus} is not a valid value for MaintenanceStatus");
            ThrowError($"{command.MantainceStatus} is not a valid value for MaintenanceStatus", 400);
        }
        if(!Enum.TryParse(command.UseFrequency, ignoreCase: true, out UseFrequency frequency))
        {
            _logger.LogError($"{command.UseFrequency} is not a valid value for UseFrequency");
            ThrowError($"{command.UseFrequency} is not a valid value for UseFrequency", 400);
        }

        using (var scope = ScopeBeginTransactionAsync())
        {
            equipmentInstance.InstalationDate = command.InstalationDate;
            equipmentInstance.MantainceStatus = maintenance;
            equipmentInstance.UseFrequency = frequency;
            equipmentInstance.EquipmentSpecificationId = command.EquipmentSpecificationId;
            equipmentInstance.EquipmentSpecification = equipmentSpecification;
            equipmentInstance.OfficeId = command.OfficeId;
            equipmentInstance.Office = office;

            await equipmentInstanceRepository.UpdateAsync(equipmentInstance, false);
            CommitTransaction(scope);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        await _unitOfWork.SaveChangesAsync();
        return new EditEquipmentInstanceResponse
        {
            Id = equipmentInstance.Id,
            InstalationDate = equipmentInstance.InstalationDate,
            MantainceStatus = command.MantainceStatus,
            UseFrequency = command.UseFrequency,
            EquipmentSpecificationId = equipmentInstance.EquipmentSpecificationId,
            OfficeId = equipmentInstance.OfficeId,
            OfficeName = office.Name,
        };
    }
}