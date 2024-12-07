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
            Name = command.Name,
            ZipCode = command.ZipCode,
            Description = command.Description,
            Latitude = command.Coordenate.Latitude,
            Longitude = command.Coordenate.Longitude,
            Street = command.Address.Street,
            Number = command.Address.Number,
            BetweenStreets = command.Address.BeetweenStreets,
            Neighborhood = command.Address.Neighborhood,
            Town = command.Address.Town,
            Province = command.Address.Province,
            Country = command.Address.Country,
        };

        await locationRepository.SaveAsync(location);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new CreateLocationResponse
        {
            Id = location.Id,
            Name = location.Name,
            ZipCode = location.ZipCode,
            Description = location.Description,
            Coordenate = new CoordenateDTO
            {
                Latitude = location.Latitude,
                Longitude = location.Longitude,
            },
            Address = new AddressDTO
            {
                Street = location.Street,
                Number = location.Number,
                BeetweenStreets = location.BetweenStreets,
                Neighborhood = location.Neighborhood,
                Town = location.Town,
                Province = location.Province,
                Country = location.Country,
            }
        };
    }
}
