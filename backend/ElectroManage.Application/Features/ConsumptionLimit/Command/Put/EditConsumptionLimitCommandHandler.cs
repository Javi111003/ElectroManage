using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Put;

public class EditConsumptionLimitCommandHandler : CoreCommandHandler<EditConsumptionLimitCommand, EditConsumptionLimitResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditConsumptionLimitCommandHandler> _logger;

    public EditConsumptionLimitCommandHandler(IUnitOfWork unitOfWork, ILogger<EditConsumptionLimitCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EditConsumptionLimitResponse> ExecuteAsync(EditConsumptionLimitCommand command, CancellationToken ct = default)
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

        var checkUniqueLimit = await consumptionLimitRepository.CountAsync(useInactive: true, filters: x => x.Limit == command.Limit && x.Id != command.Id);
        if (checkUniqueLimit > 0)
        {
            _logger.LogError("The consumption limit already exists");
            ThrowError("The Consumption limit already exists", 400);
        }

        consumptionLimit.Limit = command.Limit;

        await consumptionLimitRepository.UpdateAsync(consumptionLimit);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new EditConsumptionLimitResponse
        {
            Id = consumptionLimit.Id,
            Limit = consumptionLimit.Limit,
        };
    }
}