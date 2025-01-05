using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Location.Command.Put;
public class EditGeneralDataLocationCommandHandler : CoreCommandHandler<EditGeneralDataLocationCommand, LocationDTO>
{
    readonly ILogger<EditGeneralDataLocationCommandHandler> _logger;
    public EditGeneralDataLocationCommandHandler(IUnitOfWork unitOfWork, ILogger<EditGeneralDataLocationCommandHandler> logger) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<LocationDTO> ExecuteAsync(EditGeneralDataLocationCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var locationReporitory = UnitOfWork!.DbRepository<Domain.Entites.Location>();
        var location = await locationReporitory.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if(location is null)
        {
            _logger.LogError($"Location with id: {command.Id} not found");
            ThrowError($"Location with id: {command.Id} not found", 404);
        }
        location.Latitude = command.Latitude;
        location.Longitude = command.Longitude;
        location.AddressDetails = command.AddressDetails;
        await locationReporitory.UpdateAsync(location, false);
        await UnitOfWork!.SaveChangesAsync(ct);
        var locationDto = Mappers.LocationMapper.ToResponse(location);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return locationDto;
    }
}