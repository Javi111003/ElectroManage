using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentType.Command.Post;

public class CreateEquipmentTypeCommandHandler : CoreCommandHandler<CreateEquipmentTypeCommand, CreateEquipmentTypeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateEquipmentTypeCommandHandler> _logger;

    public CreateEquipmentTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateEquipmentTypeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateEquipmentTypeResponse> ExecuteAsync(CreateEquipmentTypeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentType>();
        var checkUniqueName = await equipmentTypeRepository.CountAsync(useInactive: true, filters: x=>x.Name == command.Name);
        if (checkUniqueName > 0)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | This name already exists");
            ThrowError("This name already exists", 400);
        }

        var equipmentType = new Domain.Entites.Equipment.EquipmentType
        {
            Name = command.Name,
            Description = command.Description,
            Created = DateTime.UtcNow
        };

        await equipmentTypeRepository.SaveAsync(equipmentType);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CreateEquipmentTypeResponse
        {
            Id = equipmentType.Id,
            Name = equipmentType.Name,
            Description = equipmentType.Description,
            Created = equipmentType.Created,
        };
    }
}
