
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Warning.Query.Get;

public class WarningGetByIdCommandHandler : CoreCommandHandler<WarningGetByIdCommand, WarningGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<WarningGetByIdCommandHandler> _logger;

    public WarningGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<WarningGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<WarningGetByIdResponse> ExecuteAsync(WarningGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var warningsRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Warning>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Warning, object>>>
        {
            x => x.Company
        };
        var warning = await warningsRepository.FirstAsync(useInactive: true, includes: include ,filters: x => x.Id == command.Id);
        if (warning is null)
        {
            _logger.LogError($"Warning with id: {command.Id} not found");
            ThrowError($"Warning with id: {command.Id} not found", 404);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new WarningGetByIdResponse
        {
            CompanyName = warning.Company.Name,
            Consumption = warning.Consumption,
            EstablishedLimit = warning.EstablishedLimit,
        };
    }
}
