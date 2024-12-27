using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentInstance.Query.Get;

internal class EquipmentInstanceGetByIdCommandHandler : CoreCommandHandler<EquipmentInstanceGetByIdCommand, EquipmentInstanceDTO>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EquipmentInstanceGetByIdCommandHandler> _logger;

    public EquipmentInstanceGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<EquipmentInstanceGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EquipmentInstanceDTO> ExecuteAsync(EquipmentInstanceGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        
        var equipmentInstanceRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentInstance>();
        var equipmentInstanceFilter = new Expression<Func<Domain.Entites.Equipment.EquipmentInstance, bool>>[]
        {
            x => x.Id == command.Id,
        };
        var equipmentInstanceInclude = new List<Expression<Func<Domain.Entites.Equipment.EquipmentInstance,object>>>
        {
            x => x.EquipmentSpecification,
            x => x.Office
        };
        var equipmentInstance = await equipmentInstanceRepository.FirstAsync(useInactive: true, filters: equipmentInstanceFilter, includes: equipmentInstanceInclude);
        if (equipmentInstance is null)
        {
            _logger.LogError($"The equipment with id {command.Id} doesn't exist");
            ThrowError($"The equipment with id {command.Id} doesn't exist", 404);
        }
        
        var equipmentSpecificationRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentSpecification>();
        var equipmentSpecificationFilter = new Expression<Func<Domain.Entites.Equipment.EquipmentSpecification, bool>>[]
        {
            x => x.Id == equipmentInstance.EquipmentSpecificationId,
        };
        var equipmentSpecificationInclude = new List<Expression<Func<Domain.Entites.Equipment.EquipmentSpecification,object>>>
        {
            x => x.EquipmentBrand,
            x => x.EquipmentType
        };

        var equipmentSpecification = await equipmentSpecificationRepository.FirstAsync(useInactive: true, includes: equipmentSpecificationInclude, filters: equipmentSpecificationFilter);
        if (equipmentSpecification is null)
        {
            _logger.LogError($"The equipment specification with id {command.Id} doesn't exist");
            ThrowError($"The equipment specification with id {command.Id} doesn't exist", 404);
        }

        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();
        var officeFilter = new Expression<Func<Domain.Entites.Offices.Office, bool>>[]
        {
            x => x.Id == equipmentInstance.OfficeId,
        };
        var officeInclude = new List<Expression<Func<Domain.Entites.Offices.Office,object>>>
        {
            x => x.Company,
        };
        var office = await officeRepository.FirstAsync(useInactive: true, includes: officeInclude, filters: officeFilter);
        if (office is null)
        {
            _logger.LogError($"The office with id {command.Id} doesn't exist");
            ThrowError($"The office with id {command.Id} doesn't exist", 404);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return EquipmentInstanceMapper.MapToEquipmentInstanceDTO(equipmentInstance);
    }
}
