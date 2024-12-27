
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentType.Query.Get;

public class ListEquipmentTypeCommandHandler : CoreCommandHandler<ListEquipmentTypeCommand, ListEquipmentTypeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListEquipmentTypeCommandHandler> _logger;

    public ListEquipmentTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<ListEquipmentTypeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<ListEquipmentTypeResponse> ExecuteAsync(ListEquipmentTypeCommand command, CancellationToken ct = default)
    {
        _logger.LogError($"{nameof(ExecuteAsync)} | Execution started");
        var equipmentTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentType>();
        var equipmentTypes = (await equipmentTypeRepository.GetAll(useInactive: true).ToListAsync())
            .Select(x => new EquipmentTypeDTO
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description!
            }).ToList();
        _logger.LogError($"{nameof(ExecuteAsync)} | Execution completted");
        return new ListEquipmentTypeResponse
        {
            EquipmentTypes = equipmentTypes,
        };
    }
}
