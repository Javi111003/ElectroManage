using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.CostFormula.Command.Put;
public class EditCostFormulaCommandHandler : CoreCommandHandler<EditCostFormulaCommand, CostFormulaDTO>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditCostFormulaCommandHandler> _logger;
    readonly ICheckUniqueService _checkUniqueService;

    public EditCostFormulaCommandHandler(IUnitOfWork unitOfWork, ILogger<EditCostFormulaCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
    }

    public async override Task<CostFormulaDTO> ExecuteAsync(EditCostFormulaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var costFormulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();
        var variableRepository = _unitOfWork.DbRepository<VariableDefinition>();
        
        var filter = new Expression<Func<Domain.Entites.Sucursal.CostFormula, bool>>[]
        {
            x => x.Id == command.FormulaId,
        };
        
        var costFormulaInclude = new List<Expression<Func<Domain.Entites.Sucursal.CostFormula,object>>>
        {
            x => x.VariableDefinitions
        };

        var costFormula = await costFormulaRepository.FirstAsync(useInactive: true, filters: filter, includes: costFormulaInclude);
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
            costFormula.Name = command.Name; 
            var checkUniqueFormula = await _checkUniqueService.CheckUniqueNameAsync(costFormula);
            if (!checkUniqueFormula)
            {
                _logger.LogError($"{nameof(ExecuteAsync)} | Already exists a formula with name: {command.Name} ");
                ThrowError("This formula already exists", 400);
            }
            costFormula.Expression = command.Expression;
            var variables = command.Variables.Select(v => new VariableDefinition
                {
                    Name = v.VariableName,
                    Expression = v.Expression,
                    Formula = costFormula
                }).ToList();
            foreach(var variable in costFormula.VariableDefinitions)
            {
                await variableRepository.DeleteAsync(variable, false);
            }
            costFormula.VariableDefinitions = variables;
            await costFormulaRepository.UpdateAsync(costFormula, false);
            await companyRepository.UpdateAsync(company,false);
            CommitTransaction(scope);
        }
        await _unitOfWork.SaveChangesAsync();
      _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

      return CostFormulaMapper.MapToCostFormulaDTO(costFormula);
    }
}