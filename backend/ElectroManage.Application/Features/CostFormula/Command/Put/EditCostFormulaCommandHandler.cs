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
        /* _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
          var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
          var costFormulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();
          var filter = new Expression<Func<Domain.Entites.Sucursal.CostFormula, bool>>[]
          {
              x => x.Id == command.FormulaId,
          };

          var costFormula = await costFormulaRepository.FirstAsync(useInactive: true, filters: filter);
          if (costFormula is null)
          {
              _logger.LogError($"The cost formula with id {command.FormulaId} doesn't exist");
              ThrowError($"The cost formula with id {command.FormulaId} doesn't exist", 404);
          }
          var company = await companyRepository.FirstAsync(useInactive: true, filters: c => c.Id == command.CompanyId);
          if (company is null)
          {
              _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {command.CompanyId} does not exists");
              ThrowError("Company with id {command.CompanyId} does not exists", 404);
          }
          using (var scope = ScopeBeginTransactionAsync())
          {
              costFormula.ExtraPerCent = command.ExtraPerCent;
              costFormula.Increase = command.Increase;
              costFormula.Company = company;
              var checkUniqueFormula = await costFormulaRepository.CountAsync(useInactive: true, filters: x => x.ExtraPerCent == command.ExtraPerCent && x.Increase == command.Increase && x.Id != command.FormulaId);
              if (checkUniqueFormula > 0)
              {
                  _logger.LogError("This formula already exists");
                  ThrowError("This formula already exists", 400);
              }
              await costFormulaRepository.UpdateAsync(costFormula, false);
              CommitTransaction(scope);
          }
          await _unitOfWork.SaveChangesAsync();
          _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
          return new EditCostFormulaResponse
          {
              Id = costFormula.Id,
              Increase = costFormula.Increase,
              ExtraPerCent = costFormula.ExtraPerCent,
          };
      }*/
        throw new NotImplementedException();
    }
}