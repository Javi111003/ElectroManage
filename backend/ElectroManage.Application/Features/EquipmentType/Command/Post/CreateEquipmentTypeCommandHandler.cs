using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentType.Command.Post;

public class CreateEquipmentTypeCommandHandler : CoreCommandHandler<CreateEquipmentTypeCommand, CreateEquipmentTypeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateEquipmentTypeCommandHandler> _logger;
    readonly ICheckUniqueService _checkUniqueService;
    public CreateEquipmentTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateEquipmentTypeCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
    }

    public async override Task<CreateEquipmentTypeResponse> ExecuteAsync(CreateEquipmentTypeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentType>();

        var equipmentType = new Domain.Entites.Equipment.EquipmentType
        {
            Name = command.Name,
            Description = command.Description,
            Created = DateTime.UtcNow
        };

        var checkUniqueName = await _checkUniqueService.CheckUniqueNameAsync(equipmentType);
        if (!checkUniqueName)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | This name already exists");
            ThrowError("This name already exists", 400);
        } 

        await equipmentTypeRepository.SaveAsync(equipmentType, false);
        await _unitOfWork.SaveChangesAsync();
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
