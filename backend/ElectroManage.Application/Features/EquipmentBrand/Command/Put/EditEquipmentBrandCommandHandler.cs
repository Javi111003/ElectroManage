using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentBrand.Command.Put;

public class EditEquipmentBrandCommandHandler : CoreCommandHandler<EditEquipmentBrandCommand, EditEquipmentBrandResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditEquipmentBrandCommandHandler> _logger;

    public EditEquipmentBrandCommandHandler(IUnitOfWork unitOfWork, ILogger<EditEquipmentBrandCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EditEquipmentBrandResponse> ExecuteAsync(EditEquipmentBrandCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentBrandRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentBrand>();
        var filter = new Expression<Func<Domain.Entites.Equipment.EquipmentBrand, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var equipmentBrand = await equipmentBrandRepository.FirstAsync(useInactive: true, filters: filter);
        if (equipmentBrand is null)
        {
            _logger.LogError($"The equipment brand with id {command.Id} doesn't exist");
            ThrowError($"The equipment brand with id {command.Id} doesn't exist", 404);
        }

        var checkUniqueName = await equipmentBrandRepository.CountAsync(useInactive: true, filters: x => x.Name == command.Name && x.Id != command.Id);
        if (checkUniqueName > 0)
        {
            _logger.LogError("This equipment brand name already exists");
            ThrowError("This equipment brand name already exists", 400);
        }

        equipmentBrand.Name = command.Name;
        equipmentBrand.Description = command.Description;

        await equipmentBrandRepository.UpdateAsync(equipmentBrand);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new EditEquipmentBrandResponse
        {
            Id = equipmentBrand.Id,
            Name = equipmentBrand.Name,
            Description = equipmentBrand.Description,
        };
    }
}
