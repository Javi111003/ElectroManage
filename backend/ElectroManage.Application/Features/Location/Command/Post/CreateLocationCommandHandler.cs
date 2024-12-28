using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Location.Command.Post;

public class CreateLocationCommandHandler : CoreCommandHandler<CreateLocationCommand, CreateLocationResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateLocationCommandHandler> _logger;

    public CreateLocationCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateLocationCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateLocationResponse> ExecuteAsync(CreateLocationCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var locationRepository = _unitOfWork.DbRepository<Domain.Entites.Location>();
        var location = new Domain.Entites.Location
        {
            AddressDetails = command.AddressDetails,
            Latitude = command.Coordenate.Latitude,
            Longitude = command.Coordenate.Longitude
        };

        await locationRepository.SaveAsync(location, false);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        await UnitOfWork!.SaveChangesAsync(ct);
        return new CreateLocationResponse
        {
            AddressDetails = location.AddressDetails,
            Coordenate = new CoordenateDTO
            {
                Latitude = location.Latitude,
                Longitude = location.Longitude,
            },
        };
    }
}
