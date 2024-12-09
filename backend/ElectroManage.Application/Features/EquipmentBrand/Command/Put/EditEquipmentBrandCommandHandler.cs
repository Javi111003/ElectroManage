using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentBrand.Command.Put;

public class EditEquipmentBrandCommandHandler : CoreCommandHandler<EditEquipmentBrandCommand, EditEquipmentBrandResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditEquipmentBrandCommandHandler> _logger;
    readonly ICheckUniqueService _checkUniqueService;
    public EditEquipmentBrandCommandHandler(IUnitOfWork unitOfWork, ILogger<EditEquipmentBrandCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
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

        using (var scope = ScopeBeginTransactionAsync())
        {
            equipmentBrand.Name = command.Name;
            equipmentBrand.Description = command.Description;
            var checkUniqueName = await _checkUniqueService.CheckUniqueNameAsync(equipmentBrand);
            if (!checkUniqueName)
            {
                _logger.LogError("This equipment brand name already exists");
                ThrowError("This equipment brand name already exists", 400);
            }
            await equipmentBrandRepository.UpdateAsync(equipmentBrand, false);
            CommitTransaction(scope);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        await _unitOfWork.SaveChangesAsync();
        return new EditEquipmentBrandResponse
        {
            Id = equipmentBrand.Id,
            Name = equipmentBrand.Name,
            Description = equipmentBrand.Description,
        };
    }
}
