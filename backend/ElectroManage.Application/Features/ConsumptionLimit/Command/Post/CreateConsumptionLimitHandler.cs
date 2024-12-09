using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Post;
public class CreateConsumptionLimitCommandHandler : CoreCommandHandler<CreateConsumptionLimitCommand, CreateConsumptionLimitResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateConsumptionLimitCommandHandler> _logger;

    public CreateConsumptionLimitCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateConsumptionLimitCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateConsumptionLimitResponse> ExecuteAsync(CreateConsumptionLimitCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var consumptionLimitRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.ConsumptionLimit>();
        var checkUniqueLimit = await consumptionLimitRepository.CountAsync(useInactive: true, filters: x=>x.Limit == command.Limit);
        if (checkUniqueLimit > 0)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | This limit already exists");
            ThrowError("This limit already exists", 400);
        }

        var consumptionLimit = new Domain.Entites.Sucursal.ConsumptionLimit
        {
            Limit = command.Limit,
            Created = DateTime.UtcNow
        };

        await consumptionLimitRepository.SaveAsync(consumptionLimit);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CreateConsumptionLimitResponse
        {
            Id = consumptionLimit.Id,
            Limit = consumptionLimit.Limit,
            Created = consumptionLimit.Created,
        };
    }
}
