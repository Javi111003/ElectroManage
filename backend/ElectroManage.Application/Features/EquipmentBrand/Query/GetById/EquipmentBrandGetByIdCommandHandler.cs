using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentBrand.Query.Get;

public class EquipmentBrandGetByIdCommandHandler : CoreQueryHandler<EquipmentBrandGetByIdCommand, EquipmentBrandGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EquipmentBrandGetByIdCommandHandler> _logger;

    public EquipmentBrandGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<EquipmentBrandGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EquipmentBrandGetByIdResponse> ExecuteAsync(EquipmentBrandGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentBrandRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentBrand>();
        var filters = new Expression<Func<Domain.Entites.Equipment.EquipmentBrand, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var equipmentBrand = await equipmentBrandRepository.FirstAsync(useInactive: true, filters:  filters);
        if (equipmentBrand is null)
        {
            _logger.LogError($"The equipment brand with id {command.Id} doesn't exist");
            ThrowError($"The equipment brand with id {command.Id} doesn't exist", 404);
        }

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new EquipmentBrandGetByIdResponse
        {
            Id = equipmentBrand.Id,
            Name = equipmentBrand.Name,
            Created = equipmentBrand.Created,
            Description = equipmentBrand.Description,
            Status = equipmentBrand.StatusBaseEntity.ToString(),
        };
    }
}
