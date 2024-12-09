using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Delete;

public class DeleteConsumptionLimitCommandHandler : CoreCommandHandler<DeleteConsumptionLimitCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteConsumptionLimitCommandHandler> _logger;

    public DeleteConsumptionLimitCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteConsumptionLimitCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<Response<NoContentData>> ExecuteAsync(DeleteConsumptionLimitCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var consumptionLimitRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.ConsumptionLimit>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.ConsumptionLimit, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var consumptionLimit = await consumptionLimitRepository.FirstAsync(useInactive: true, filters: filter);
        if (consumptionLimit is null)
        {
            _logger.LogError($"The consumption limit with id {command.Id} doesn't exist");
            ThrowError($"The consumption limit with id {command.Id} doesn't exist", 404);
        }

        consumptionLimit.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await consumptionLimitRepository.UpdateAsync(consumptionLimit);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}