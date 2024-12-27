using Bogus.DataSets;
using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Enums.Equipment;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentInstance.Command.Post;

public class CreateEquipmentInstanceCommandHandler : CoreCommandHandler<CreateEquipmentInstanceCommand, CreateEquipmentInstanceResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateEquipmentInstanceCommandHandler> _logger;

    public CreateEquipmentInstanceCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateEquipmentInstanceCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateEquipmentInstanceResponse> ExecuteAsync(CreateEquipmentInstanceCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentInstanceRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentInstance>();
        var equipmentSpecificationRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentSpecification>();
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();

        var equipmentSpecificationInclude = new List<Expression<Func<Domain.Entites.Equipment.EquipmentSpecification,object>>>
        {
            x => x.EquipmentBrand,
            x => x.EquipmentType
        };
        var equipmentSpecification = await equipmentSpecificationRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.EquipmentSpecificationId, includes: equipmentSpecificationInclude);
        if (equipmentSpecification is null)
        {
            _logger.LogError($"Equipment Specification with id: {command.EquipmentSpecificationId} not found");
            ThrowError($"Equipment Specification with id: {command.EquipmentSpecificationId} not found", 404);
        }

        var officeInclude = new List<Expression<Func<Domain.Entites.Offices.Office,object>>>
        {
            x => x.Company
        };
        
        var office = await officeRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.OfficeId, includes: officeInclude);
        if (office is null)
        {
            _logger.LogError($"Office with id: {command.OfficeId} not found");
            ThrowError($"Office with id: {command.OfficeId} not found", 404);
        }

        if(!Enum.TryParse(command.MaintenanceStatus, ignoreCase: true, out MaintenanceStatus maintenance))
        {
            _logger.LogError($"{command.MaintenanceStatus} is not a valid value for MaintenanceStatus");
            ThrowError($"{command.MaintenanceStatus} is not a valid value for MaintenanceStatus", 400);
        }
        if(!Enum.TryParse(command.UseFrequency, ignoreCase: true, out UseFrequency frequency))
        {
            _logger.LogError($"{command.UseFrequency} is not a valid value for UseFrequency");
            ThrowError($"{command.UseFrequency} is not a valid value for UseFrequency", 400);
        }     

        var equipmentInstance = new Domain.Entites.Equipment.EquipmentInstance
        {
            InstalationDate = command.InstalationDate,
            MantainceStatus = maintenance,
            UseFrequency = frequency,
            EquipmentSpecificationId = command.EquipmentSpecificationId,
            EquipmentSpecification = equipmentSpecification,
            OfficeId = command.OfficeId,
            Office = office
        };

        await equipmentInstanceRepository.SaveAsync(equipmentInstance,false);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        await _unitOfWork.SaveChangesAsync();
        
        return new CreateEquipmentInstanceResponse
        {
            EquipmentInstance = EquipmentInstanceMapper.MapToEquipmentInstanceDTO(equipmentInstance),
            Created = DateTime.UtcNow,
        };
    }
}
