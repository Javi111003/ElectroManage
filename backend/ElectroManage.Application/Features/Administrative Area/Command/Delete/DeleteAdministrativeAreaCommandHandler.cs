using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Administrative_Area.Command.Delete;

public class DeleteAdministrativeAreaCommandHandler : CoreCommandHandler<DeleteAdministrativeAreaCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteAdministrativeAreaCommandHandler> _logger;

    public DeleteAdministrativeAreaCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteAdministrativeAreaCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<Response<NoContentData>> ExecuteAsync(DeleteAdministrativeAreaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var administrativeAreaReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.AministrativeArea>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.AministrativeArea, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var adminstrativeArea = await administrativeAreaReporitory.FirstAsync(useInactive: true, filters: filter);
        if (adminstrativeArea is null)
        {
            _logger.LogError($"This administrative area with id {command.Id} does'nt exists");
            ThrowError($"This administrative area with id {command.Id} does'nt exists", 404);
        }

        adminstrativeArea.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await administrativeAreaReporitory.UpdateAsync(adminstrativeArea);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
