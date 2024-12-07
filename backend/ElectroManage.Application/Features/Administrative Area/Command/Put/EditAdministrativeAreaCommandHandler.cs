
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Administrative_Area.Command.Put;

public class EditAdministrativeAreaCommandHandler : CoreCommandHandler<EditAdministrativeAreaCommand, EditAdministrativeAreaResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditAdministrativeAreaCommandHandler> _logger;

    public EditAdministrativeAreaCommandHandler(IUnitOfWork unitOfWork, ILogger<EditAdministrativeAreaCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EditAdministrativeAreaResponse> ExecuteAsync(EditAdministrativeAreaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var administrativeAreaReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.AministrativeArea>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.AministrativeArea, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var administrativeArea = await administrativeAreaReporitory.FirstAsync(useInactive: true, filters: filter);
        if (administrativeArea is null)
        {
            _logger.LogError($"This administrative area with id {command.Id} does'nt exists");
            ThrowError("This administrative area with id {command.Id} does'nt exists", 404);
        }

        var checkUniqueName = await administrativeAreaReporitory.CountAsync(useInactive: true, filters: x => x.Name == command.Name && x.Id != command.Id);
        if (checkUniqueName > 0)
        {
            _logger.LogError("This administrative area name already exists");
            ThrowError("This administrative area name already exists", 400);
        }

        administrativeArea.Name = command.Name;
        administrativeArea.Description = command.Description;

        await administrativeAreaReporitory.UpdateAsync(administrativeArea);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new EditAdministrativeAreaResponse
        {
            Id = administrativeArea.Id,
            Name = administrativeArea.Name,
            Description = administrativeArea.Description,
        };
    }
}
