using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentSpecification.Query.Get;

internal class EquipmentSpecificationGetByIdCommandHandler : CoreCommandHandler<EquipmentSpecificationGetByIdCommand, EquipmentSpecificationGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EquipmentSpecificationGetByIdCommandHandler> _logger;

    public EquipmentSpecificationGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<EquipmentSpecificationGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EquipmentSpecificationGetByIdResponse> ExecuteAsync(EquipmentSpecificationGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentSpecificationRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentSpecification>();
        var filters = new Expression<Func<Domain.Entites.Equipment.EquipmentSpecification, bool>>[]
        {
            x => x.Id == command.Id,
        };
        var includes = new List<Expression<Func<Domain.Entites.Equipment.EquipmentSpecification,object>>>
        {
            x => x.EquipmentBrand,
            x => x.EquipmentType
        };

        var equipmentSpecification = await equipmentSpecificationRepository.FirstAsync(useInactive: true, includes: includes, filters: filters);
        if (equipmentSpecification is null)
        {
            _logger.LogError($"The equipment specification with id {command.Id} doesn't exist");
            ThrowError($"The equipment specification with id {command.Id} doesn't exist", 404);
        }

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new EquipmentSpecificationGetByIdResponse
        {
            Id = equipmentSpecification.Id,
            Model = equipmentSpecification.Model,
            Capacity = equipmentSpecification.Capacity,
            CriticalEnergySystem = equipmentSpecification.CriticalEnergySystem,
            AverageConsumption = equipmentSpecification.AverageConsumption,
            LifeSpanYears = equipmentSpecification.LifeSpanYears,
            Efficiency = equipmentSpecification.Efficiency,
            EquipmentBrand = equipmentSpecification.EquipmentBrand.Name,
            EquipmentBrandId = equipmentSpecification.EquipmentBrandId,
            EquipmentType = equipmentSpecification.EquipmentType.Name,
            EquipmentTypeId = equipmentSpecification.EquipmentTypeId,
            Created = equipmentSpecification.Created,
            Status = equipmentSpecification.StatusBaseEntity.ToString(),
        };
    }
}