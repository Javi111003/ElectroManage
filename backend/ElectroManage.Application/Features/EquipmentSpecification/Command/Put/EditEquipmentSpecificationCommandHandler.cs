using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentSpecification.Command.Put;
public class EditEquipmentSpecificationCommandHandler : CoreCommandHandler<EditEquipmentSpecificationCommand, EditEquipmentSpecificationResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditEquipmentSpecificationCommandHandler> _logger;

    public EditEquipmentSpecificationCommandHandler(IUnitOfWork unitOfWork, ILogger<EditEquipmentSpecificationCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EditEquipmentSpecificationResponse> ExecuteAsync(EditEquipmentSpecificationCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentSpecificationRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentSpecification>();
        var equipmentBrandRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentBrand>();
        var equipmentTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentType>();
        
        var filter = new Expression<Func<Domain.Entites.Equipment.EquipmentSpecification, bool>>[]
        {
            x => x.Id == command.Id,
        };
        var brandFilter = new Expression<Func<Domain.Entites.Equipment.EquipmentBrand, bool>>[]
        {
            x => x.Id == command.EquipmentBrandId,
        };
        var typeFilter = new Expression<Func<Domain.Entites.Equipment.EquipmentType, bool>>[]
        {
            x => x.Id == command.EquipmentTypeId,
        };
        
        var equipmentSpecification = await equipmentSpecificationRepository.FirstAsync(useInactive: true, filters: filter);
        var equipmentBrand = await equipmentBrandRepository.FirstAsync(useInactive: true, filters:  brandFilter);
        var equipmentType = await equipmentTypeRepository.FirstAsync(useInactive: true, filters:  typeFilter);
            
        if (equipmentSpecification is null)
        {
            _logger.LogError($"This equipment specification with id {command.Id} doesn't exist");
            ThrowError($"This equipment specification with id {command.Id} doesn't exist", 404);
        }
        if (equipmentBrand is null)
        {
            _logger.LogError($"The equipment brand with id {command.EquipmentBrandId} doesn't exist");
            ThrowError($"The equipment brand with id {command.EquipmentBrandId} doesn't exist", 404);
        }
        if (equipmentType is null)
        {
            _logger.LogError($"The equipment type with id {command.EquipmentTypeId} doesn't exist");
            ThrowError($"The equipment type with id {command.EquipmentTypeId} doesn't exist", 404);
        }
        
        using(var scope = ScopeBeginTransactionAsync())
        {    
            equipmentSpecification.Model = command.Model;
            equipmentSpecification.Capacity = command.Capacity;
            equipmentSpecification.CriticalEnergySystem = command.CriticalEnergySystem;
            equipmentSpecification.AverageConsumption = command.AverageConsumption;
            equipmentSpecification.LifeSpanYears = command.LifeSpanYears;
            equipmentSpecification.Efficiency = command.Efficiency;
            equipmentSpecification.EquipmentBrand = equipmentBrand;
            equipmentSpecification.EquipmentBrandId = equipmentBrand.Id;
            equipmentSpecification.EquipmentType = equipmentType;
            equipmentSpecification.EquipmentTypeId = equipmentType.Id;

            await equipmentSpecificationRepository.UpdateAsync(equipmentSpecification,false);
            CommitTransaction(scope);
        }
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new EditEquipmentSpecificationResponse
        {
            Id = equipmentSpecification.Id,
            Model = equipmentSpecification.Model,
            Capacity = equipmentSpecification.Capacity,
            CriticalEnergySystem = equipmentSpecification.CriticalEnergySystem,
            AverageConsumption = equipmentSpecification.AverageConsumption,
            LifeSpanYears = equipmentSpecification.LifeSpanYears,
            Efficiency = equipmentSpecification.Efficiency,
            EquipmentBrand = equipmentBrand.Name,
            EquipmentBrandId = equipmentSpecification.EquipmentBrandId,
            EquipmentType = equipmentType.Name,
            EquipmentTypeId = equipmentSpecification.EquipmentTypeId,
        };
    }
}