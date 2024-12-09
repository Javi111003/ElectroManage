using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentType.Query.Get;

internal class EquipmentTypeGetByIdCommandHandler : CoreCommandHandler<EquipmentTypeGetByIdCommand, EquipmentTypeGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EquipmentTypeGetByIdCommandHandler> _logger;

    public EquipmentTypeGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<EquipmentTypeGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EquipmentTypeGetByIdResponse> ExecuteAsync(EquipmentTypeGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var equipmentTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentType>();
        var filters = new Expression<Func<Domain.Entites.Equipment.EquipmentType, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var equipmentType = await equipmentTypeRepository.FirstAsync(useInactive: true, filters:  filters);
        if (equipmentType is null)
        {
            _logger.LogError($"The equipment type with id {command.Id} doesn't exist");
            ThrowError($"The equipment type with id {command.Id} doesn't exist", 404);
        }

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new EquipmentTypeGetByIdResponse
        {
            Id = equipmentType.Id,
            Name = equipmentType.Name,
            Created = equipmentType.Created,
            Description = equipmentType.Description,
            Status = equipmentType.StatusBaseEntity.ToString(),
        };
    }
}
