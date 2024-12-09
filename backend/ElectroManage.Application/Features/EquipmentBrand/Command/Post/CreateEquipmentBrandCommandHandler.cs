using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentBrand.Command.Post;

public class CreateEquipmentBrandCommandHandler : CoreCommandHandler<CreateEquipmentBrandCommand, CreateEquipmentBrandResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateEquipmentBrandCommandHandler> _logger;
    readonly ICheckUniqueService _cheqUniqueService;

    public CreateEquipmentBrandCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateEquipmentBrandCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _cheqUniqueService = checkUniqueService;
    }

    public async override Task<CreateEquipmentBrandResponse> ExecuteAsync(CreateEquipmentBrandCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentBrandRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentBrand>();


        var equipmentBrand = new Domain.Entites.Equipment.EquipmentBrand
        {
            Name = command.Name,
            Description = command.Description,
            Created = DateTime.UtcNow
        };

        var checkUniqueName = await _cheqUniqueService.CheckUniqueNameAsync(equipmentBrand);
        if (!checkUniqueName)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | This name already exists");
            ThrowError("This name already exists", 400);
        }

        await equipmentBrandRepository.SaveAsync(equipmentBrand,false);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        await UnitOfWork!.SaveChangesAsync();
        return new CreateEquipmentBrandResponse
        {
            Id = equipmentBrand.Id,
            Name = equipmentBrand.Name,
            Description = equipmentBrand.Description,
            Created = equipmentBrand.Created,
        };
    }
}
