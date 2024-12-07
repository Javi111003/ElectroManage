
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Administrative_Area.Query.Get;

internal class AdministrativeAreaGetByIdCommandHandler : CoreCommandHandler<AdministrativeAreaGetByIdCommand, AdministrativeAreaGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<AdministrativeAreaGetByIdCommandHandler> _logger;

    public AdministrativeAreaGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<AdministrativeAreaGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<AdministrativeAreaGetByIdResponse> ExecuteAsync(AdministrativeAreaGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var administrativeAreaReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.AministrativeArea>();
        var filters = new Expression<Func<Domain.Entites.Sucursal.AministrativeArea, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var administrativeArea = await administrativeAreaReporitory.FirstAsync(useInactive: true, filters:  filters);
        if (administrativeArea is null)
        {
            _logger.LogError($"The administrative area with id {command.Id} does'nt exists");
            ThrowError($"The administrative area with id {command.Id} does'nt exists", 404);
        }

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new AdministrativeAreaGetByIdResponse
        {
            Id = administrativeArea.Id,
            Name = administrativeArea.Name,
            Created = administrativeArea.Created,
            Status = administrativeArea.StatusBaseEntity.ToString(),
        };
    }
}
