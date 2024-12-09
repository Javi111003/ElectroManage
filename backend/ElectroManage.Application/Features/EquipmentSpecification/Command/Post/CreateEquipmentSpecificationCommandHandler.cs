using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentSpecification.Command.Post;
public class CreateEquipmentSpecificationCommandHandler : CoreCommandHandler<CreateEquipmentSpecificationCommand, CreateEquipmentSpecificationResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateEquipmentSpecificationCommandHandler> _logger;

    public CreateEquipmentSpecificationCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateEquipmentSpecificationCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateEquipmentSpecificationResponse> ExecuteAsync(CreateEquipmentSpecificationCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentSpecificationRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentSpecification>();
        var equipmentBrandRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentBrand>();
        var equipmentTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentType>();

        var brandFilter = new Expression<Func<Domain.Entites.Equipment.EquipmentBrand, bool>>[]
        {
            x => x.Id == command.EquipmentBrandId,
        };
        var typeFilter = new Expression<Func<Domain.Entites.Equipment.EquipmentType, bool>>[]
        {
            x => x.Id == command.EquipmentTypeId,
        };
        
        var equipmentBrand = await equipmentBrandRepository.FirstAsync(useInactive: true, filters:  brandFilter);
        var equipmentType = await equipmentTypeRepository.FirstAsync(useInactive: true, filters:  typeFilter);
        
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

        var equipmentSpecification = new Domain.Entites.Equipment.EquipmentSpecification
        {
            Model = command.Model,
            Capacity = command.Capacity,
            CriticalEnergySystem = command.CriticalEnergySystem,
            AverageConsumption = command.AverageConsumption,
            LifeSpanYears = command.LifeSpanYears,
            Efficiency = command.Efficiency,
            EquipmentBrand = equipmentBrand,
            EquipmentBrandId = equipmentBrand.Id,
            EquipmentType = equipmentType,
            EquipmentTypeId = equipmentType.Id,
            Created = DateTime.UtcNow
        };

        await equipmentSpecificationRepository.SaveAsync(equipmentSpecification,false);
        
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        
        return new CreateEquipmentSpecificationResponse
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
            Created = DateTime.UtcNow
        };
    }
}
