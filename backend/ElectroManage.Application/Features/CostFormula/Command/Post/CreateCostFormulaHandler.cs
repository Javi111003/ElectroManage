using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.CostFormula.Command.Post;
public class CreateCostFormulaCommandHandler : CoreCommandHandler<CreateCostFormulaCommand, CreateCostFormulaResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateCostFormulaCommandHandler> _logger;
    readonly ICheckUniqueService _checkUniqueService;
    public CreateCostFormulaCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateCostFormulaCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
    }
    public async override Task<CreateCostFormulaResponse> ExecuteAsync(CreateCostFormulaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var costFormulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();
        var company = await companyRepository.FirstAsync(useInactive: true, filters: c => c.Id == command.CompanyId);
        if (company is null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {command.CompanyId} does not exists");
            ThrowError($"Company with id {command.CompanyId} does not exists", 404);
        }
        var costFormula = new Domain.Entites.Sucursal.CostFormula
        {
            Name = command.Name,
            Company = company,
            Expression = command.Expression
        };
        using (var scopeDoWork = ScopeBeginTransactionAsync())
        {
            var checkUniqueFormula = await _checkUniqueService.CheckUniqueNameAsync(costFormula);
            if (!checkUniqueFormula)
            {
                _logger.LogError($"{nameof(ExecuteAsync)} | One formula with name {command.Name} already exists");
                ThrowError("This formula already exists", 400);
            }
            await costFormulaRepository.SaveAsync(costFormula);
            var variables = command.Variables.Select(v => new VariableDefinition
            {
                Name = v.VariableName,
                Expression = v.Expression,
                StaticValue = v.Value,
                Formula = costFormula
            }).ToList();
            costFormula.VariableDefinitions = variables;
            await costFormulaRepository.UpdateAsync(costFormula, false);
            CommitTransaction(scopeDoWork);
        }
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CreateCostFormulaResponse
        {
            Id = costFormula.Id,
            Name = costFormula.Name,
            Expression = costFormula.Expression,
            Created = costFormula.Created
        };
    }
}