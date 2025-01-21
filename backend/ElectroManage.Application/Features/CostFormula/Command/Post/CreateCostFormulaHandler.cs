using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.CostFormula.Command.Post;
public class CreateCostFormulaCommandHandler : CoreCommandHandler<CreateCostFormulaCommand, CostFormulaDTO>
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
    public async override Task<CostFormulaDTO> ExecuteAsync(CreateCostFormulaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var costFormulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();

        var company = await companyRepository.FirstAsync(useInactive: false, filters: c => c.Id == command.CompanyId);
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
                _logger.LogError($"{nameof(ExecuteAsync)} | Already exists a formula with name: {command.Name} ");
                ThrowError("This formula already exists", 400);
            }
            await costFormulaRepository.SaveAsync(costFormula);
            var variables = command.Variables.Select(v => new VariableDefinition
            {
                Name = v.VariableName,
                Expression = v.Expression,
                Formula = costFormula
            }).ToList();
            costFormula.VariableDefinitions = variables;
            await costFormulaRepository.UpdateAsync(costFormula, false);
            CommitTransaction(scopeDoWork);
        }
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return CostFormulaMapper.MapToCostFormulaDTO(costFormula);
    }
}