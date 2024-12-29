using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentBrand.Query.ListAll;

public class ListEquipmentBrandQueryHandler : CoreQueryHandler<ListEquipmentBrandQuery, IEnumerable<EquipmentBrandDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListEquipmentBrandQueryHandler> _logger;

    public ListEquipmentBrandQueryHandler(IUnitOfWork unitOfWork, ILogger<ListEquipmentBrandQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<EquipmentBrandDTO>> ExecuteAsync(ListEquipmentBrandQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var equipmentBrandRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentBrand>();
        var equipmentBrands = (await equipmentBrandRepository.GetAll(useInactive: true).ToListAsync())
            .Select(x => new EquipmentBrandDTO
            {
                Id = x.Id,
                Name = x.Name,
            }).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return equipmentBrands;
    }
}