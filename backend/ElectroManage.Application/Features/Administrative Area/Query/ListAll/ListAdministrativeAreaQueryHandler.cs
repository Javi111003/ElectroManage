using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Administrative_Area.Query.Get;
public class ListAdministrativeAreaQueryHandler : CoreQueryHandler<ListAdministrativeAreaQuery, IEnumerable<AdministrativeAreaDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListAdministrativeAreaQueryHandler> _logger;

    public ListAdministrativeAreaQueryHandler(IUnitOfWork unitOfWork, ILogger<ListAdministrativeAreaQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }
    public override async Task<IEnumerable<AdministrativeAreaDTO>> ExecuteAsync(ListAdministrativeAreaQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var administrativeAreaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.AministrativeArea>();
        var administrativeAreas = (await administrativeAreaRepository.GetAll(useInactive: true).ToListAsync())
            .Select(x => new AdministrativeAreaDTO
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
            }).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return administrativeAreas;
    }
}