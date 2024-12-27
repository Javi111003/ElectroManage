
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentBrand.Query.Get;

public class ListEquipmentBrandCommandHandler : CoreCommandHandler<ListEquipmentBrandCommand, ListEquipmentBrandResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListEquipmentBrandCommandHandler> _logger;

    public ListEquipmentBrandCommandHandler(IUnitOfWork unitOfWork, ILogger<ListEquipmentBrandCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<ListEquipmentBrandResponse> ExecuteAsync(ListEquipmentBrandCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var equipmentBrandRepository = _unitOfWork.DbRepository<Domain.Entites.Equipment.EquipmentBrand>();
        var equipmentBrands = (await equipmentBrandRepository.GetAll(useInactive: true).ToListAsync())
            .Select(x => new EquipmentBrandDTO
            { 
                Id = x.Id,
                Name = x.Name,
                Description = x.Description!,
            }).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new ListEquipmentBrandResponse
        {
            EquipmentBrands = equipmentBrands
        };
    }
}
