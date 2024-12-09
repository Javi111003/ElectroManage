using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentBrand.Command.Post;

public class CreateEquipmentBrandCommandHandler : CoreCommandHandler<CreateEquipmentBrandCommand, CreateEquipmentBrandResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateEquipmentBrandCommandHandler> _logger;

    public CreateEquipmentBrandCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateEquipmentBrandCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateEquipmentBrandResponse> ExecuteAsync(CreateEquipmentBrandCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentBrandRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentBrand>();
        var checkUniqueName = await equipmentBrandRepository.CountAsync(useInactive: true, filters: x=>x.Name == command.Name);
        if (checkUniqueName > 0)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | This name already exists");
            ThrowError("This name already exists", 400);
        }

        var equipmentBrand = new Domain.Entites.Equipment.EquipmentBrand
        {
            Name = command.Name,
            Description = command.Description,
            Created = DateTime.UtcNow
        };

        await equipmentBrandRepository.SaveAsync(equipmentBrand);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CreateEquipmentBrandResponse
        {
            Id = equipmentBrand.Id,
            Name = equipmentBrand.Name,
            Description = equipmentBrand.Description,
            Created = equipmentBrand.Created,
        };
    }
}
