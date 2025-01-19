using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.CostFormula.Query.Get;
public class CostFormulaGetByIdCommandHandler : CoreQueryHandler<CostFormulaGetByIdCommand, CostFormulaGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CostFormulaGetByIdCommandHandler> _logger;

    public CostFormulaGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<CostFormulaGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CostFormulaGetByIdResponse> ExecuteAsync(CostFormulaGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");

         var costFormulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();
         var filters = new Expression<Func<Domain.Entites.Sucursal.CostFormula, bool>>[]
         {
             x => x.Id == command.Id,
         };

         var costFormula = await costFormulaRepository.FirstAsync(useInactive: true, filters:  filters);
         if (costFormula is null)
         {
             _logger.LogError($"The cost formula with id {command.Id} doesn't exist");
             ThrowError($"The cost formula with id {command.Id} doesn't exist", 404);
         }

         _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

         return new CostFormulaGetByIdResponse
         {
             Id = costFormula.Id,
             Name = costFormula.Name,
             Expression = costFormula.Expression,
             Variables = costFormula.VariableDefinitions.Select(v => new VariableDefinitionDto
             {
                 VariableName = v.Name,
                 Expression = v.Expression
             }).ToList(),
         };
     }
}