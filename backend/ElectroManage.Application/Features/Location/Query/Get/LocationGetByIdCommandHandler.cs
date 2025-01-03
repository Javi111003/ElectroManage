﻿using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Location.Query.Get;

public class LocationGetByIdCommandHandler : CoreQueryHandler<LocationGetByIdCommand, LocationGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<LocationGetByIdCommandHandler> _logger;

    public LocationGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<LocationGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<LocationGetByIdResponse> ExecuteAsync(LocationGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var locationReporitory = _unitOfWork.DbRepository<Domain.Entites.Location>();
        var filter = new Expression<Func<Domain.Entites.Location, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var location = await locationReporitory.FirstAsync(useInactive: true, filters: filter);
        if (location is null)
        {
            _logger.LogError($"Location with id {command.Id} not found");
            ThrowError($"Location with id {command.Id} not found", 404);
        }

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new LocationGetByIdResponse
        {
            Id = location.Id,
            Coordenate = new CoordenateDTO
            {
                Latitude = location.Latitude,
                Longitude = location.Longitude,
            },
            AddressDetails = location.AddressDetails
        };
    }
}