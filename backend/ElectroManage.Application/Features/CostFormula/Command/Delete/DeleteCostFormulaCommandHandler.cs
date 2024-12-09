using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.CostFormula.Command.Delete;

public class DeleteCostFormulaCommandHandler : CoreCommandHandler<DeleteCostFormulaCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteCostFormulaCommandHandler> _logger;

    public DeleteCostFormulaCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteCostFormulaCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<Response<NoContentData>> ExecuteAsync(DeleteCostFormulaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

        var costFormulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.CostFormula, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var costFormula = await costFormulaRepository.FirstAsync(useInactive: true, filters: filter);
        if (costFormula is null)
        {
            _logger.LogError($"The cost formula with id {command.Id} doesn't exist");
            ThrowError($"The cost formula with id {command.Id} doesn't exist", 404);
        }

        costFormula.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await costFormulaRepository.UpdateAsync(costFormula);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}