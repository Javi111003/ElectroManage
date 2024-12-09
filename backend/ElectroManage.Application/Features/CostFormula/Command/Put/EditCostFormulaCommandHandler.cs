using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.CostFormula.Command.Put;
public class EditCostFormulaCommandHandler : CoreCommandHandler<EditCostFormulaCommand, EditCostFormulaResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditCostFormulaCommandHandler> _logger;

    public EditCostFormulaCommandHandler(IUnitOfWork unitOfWork, ILogger<EditCostFormulaCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EditCostFormulaResponse> ExecuteAsync(EditCostFormulaCommand command, CancellationToken ct = default)
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

        var checkUniqueFormula = await costFormulaRepository.CountAsync(useInactive: true, filters: x=>x.ExtraPerCent == command.ExtraPerCent && x.Increase == command.Increase && x.Id != command.Id);
        if (checkUniqueFormula > 0)
        {
            _logger.LogError("This administrative area name already exists");
            ThrowError("This administrative area name already exists", 400);
        }

        costFormula.ExtraPerCent = command.ExtraPerCent;
        costFormula.Increase = command.Increase;

        await costFormulaRepository.UpdateAsync(costFormula,false);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        await _unitOfWork.CommitChangesAsync(false);
        return new EditCostFormulaResponse
        {
            Id = costFormula.Id,
            Increase = costFormula.Increase,
            ExtraPerCent = costFormula.ExtraPerCent,
        };
    }
}
