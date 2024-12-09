using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.ConsumptionLimit.Query.Get;

internal class ConsumptionLimitGetByIdCommandHandler : CoreCommandHandler<ConsumptionLimitGetByIdCommand, ConsumptionLimitGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ConsumptionLimitGetByIdCommandHandler> _logger;

    public ConsumptionLimitGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<ConsumptionLimitGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<ConsumptionLimitGetByIdResponse> ExecuteAsync(ConsumptionLimitGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var consumptionLimitRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.ConsumptionLimit>();
        var filters = new Expression<Func<Domain.Entites.Sucursal.ConsumptionLimit, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var consumptionLimit = await consumptionLimitRepository.FirstAsync(useInactive: true, filters:  filters);
        if (consumptionLimit is null)
        {
            _logger.LogError($"The consumption limit with id {command.Id} doesn't exist");
            ThrowError($"The consumption limit with id {command.Id} doesn't exist", 404);
        }

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return new ConsumptionLimitGetByIdResponse
        {
            Id = consumptionLimit.Id,
            Limit = consumptionLimit.Limit,
            Created = consumptionLimit.Created,
            Status = consumptionLimit.StatusBaseEntity.ToString(),
        };
    }
}