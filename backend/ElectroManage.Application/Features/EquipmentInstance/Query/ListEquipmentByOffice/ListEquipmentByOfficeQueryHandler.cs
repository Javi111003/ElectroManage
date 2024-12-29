using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentInstance.Query.ListEquipmentByOffice;

public class ListEquipmentByOfficeQueryHandler : CoreQueryHandler<ListEquipmentByOfficeQuery, IEnumerable<EquipmentInstanceDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListEquipmentByOfficeQueryHandler> _logger;

    public ListEquipmentByOfficeQueryHandler(IUnitOfWork unitOfWork, ILogger<ListEquipmentByOfficeQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<EquipmentInstanceDTO>> ExecuteAsync(ListEquipmentByOfficeQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();
        
        var office = await officeRepository.GetAllListOnly(useInactive: true, filters: x => x.Id == command.OfficeId)
        .Include(x => x.Company)
        .Include(x => x.Equipments)
            .ThenInclude(x => x.EquipmentSpecification)
            .ThenInclude(x => x.EquipmentBrand)
        .Include(x => x.Equipments)
            .ThenInclude(x => x.EquipmentSpecification)
            .ThenInclude(x => x.EquipmentType)
        .ToListAsync();
        if (office == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Office with id {command.OfficeId} not found");
            ThrowError($"Office with id {command.OfficeId} not found", 404);
        }
        var equipments = office[0].Equipments.Select(x => EquipmentInstanceMapper.MapToEquipmentInstanceDTO(x)).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return equipments;
    }
}