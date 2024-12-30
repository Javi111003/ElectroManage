
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Location.Command.Put;

public class EditGeneralDataLocationCommandHandler : CoreCommandHandler<EditGeneralDataLocationCommand, EditGeneralDataLocationResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditGeneralDataLocationCommandHandler> _logger;

    public EditGeneralDataLocationCommandHandler(IUnitOfWork unitOfWork, ILogger<EditGeneralDataLocationCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<EditGeneralDataLocationResponse> ExecuteAsync(EditGeneralDataLocationCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var locationReporitory = _unitOfWork.DbRepository<Domain.Entites.Location>();
        var location = await locationReporitory.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if(location is null)
        {
            _logger.LogError($"Location with id: {command.Id} not found");
            ThrowError($"Location with id: {command.Id} not found", 404);
        }
        location.Name = command.Name;
        location.Description = command.Description;
        location.ZipCode = command.ZipCode;
        location.Latitude = command.Latitude;
        location.Longitude = command.Longitude;
        location.Number = command.Address.Number;
        location.Street = command.Address.Street;
        location.Neighborhood = command.Address.Neighborhood;
        location.BetweenStreets = command.Address.BeetweenStreets;
        location.Town = command.Address.Town;
        location.Country = command.Address.Country;
        location.Province = command.Address.Province;
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return Mappers.LocationMapper.ToResponse(location);
    }
}
