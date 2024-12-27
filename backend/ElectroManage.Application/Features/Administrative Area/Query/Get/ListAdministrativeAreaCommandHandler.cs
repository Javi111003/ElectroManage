using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace ElectroManage.Application.Features.Administrative_Area.Query.Get;

public class ListAdministrativeAreaCommandHandler : CoreCommandHandler<ListAdministrativeAreaCommand, ListAdministrativeAreaResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListAdministrativeAreaCommandHandler> _logger;

    public ListAdministrativeAreaCommandHandler(IUnitOfWork unitOfWork, ILogger<ListAdministrativeAreaCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }
    public override async Task<ListAdministrativeAreaResponse> ExecuteAsync(ListAdministrativeAreaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var administrativeAreaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.AministrativeArea>();
        var administrativeAreas = (await administrativeAreaRepository.GetAll(useInactive: true).ToListAsync())
            .Select(x => new AdministrativeAreaDTO
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
            });
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new ListAdministrativeAreaResponse
        {
            Response = administrativeAreas.ToList(),
        };
    }
}
