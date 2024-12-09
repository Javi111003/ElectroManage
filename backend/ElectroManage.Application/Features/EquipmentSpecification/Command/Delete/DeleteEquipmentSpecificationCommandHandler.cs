using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentSpecification.Command.Delete;

public class DeleteEquipmentSpecificationCommandHandler : CoreCommandHandler<DeleteEquipmentSpecificationCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteEquipmentSpecificationCommandHandler> _logger;

    public DeleteEquipmentSpecificationCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteEquipmentSpecificationCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<Response<NoContentData>> ExecuteAsync(DeleteEquipmentSpecificationCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var equipmentSpecificationRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentSpecification>();
        var filter = new Expression<Func<Domain.Entites.Equipment.EquipmentSpecification, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var equipmentSpecification = await equipmentSpecificationRepository.FirstAsync(useInactive: true, filters: filter);
        if (equipmentSpecification is null)
        {
            _logger.LogError($"This equipment specification with id {command.Id} doesn't exist");
            ThrowError($"This equipment specification with id {command.Id} doesn't exist", 404);
        }

        equipmentSpecification.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await equipmentSpecificationRepository.UpdateAsync(equipmentSpecification);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}