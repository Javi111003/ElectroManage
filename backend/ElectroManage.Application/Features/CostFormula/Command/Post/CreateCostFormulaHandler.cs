using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.CostFormula.Command.Post;
public class CreateCostFormulaCommandHandler : CoreCommandHandler<CreateCostFormulaCommand, CreateCostFormulaResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateCostFormulaCommandHandler> _logger;
    public CreateCostFormulaCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateCostFormulaCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateCostFormulaResponse> ExecuteAsync(CreateCostFormulaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var costFormulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();
        var checkUniqueFormula = await costFormulaRepository.CountAsync(useInactive: true, filters: x=>x.ExtraPerCent == command.ExtraPerCent && x.Increase == command.Increase);
        if (checkUniqueFormula > 0)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | This formula already exists");
            ThrowError("This formula already exists", 400);
        }
        var company = await companyRepository.FirstAsync(useInactive: true, filters: c => c.Id == command.CompanyId); 
        if(company is null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {command.CompanyId} does not exists");
            ThrowError($"Company with id {command.CompanyId} does not exists", 404);
        }
        var costFormula = new Domain.Entites.Sucursal.CostFormula
        {
            Company = company,
            ExtraPerCent = command.ExtraPerCent,
            Increase = command.Increase,
            Created = DateTime.UtcNow
        };

        await costFormulaRepository.SaveAsync(costFormula);

        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CreateCostFormulaResponse
        {
            Id = costFormula.Id,
            ExtraPerCent = costFormula.ExtraPerCent,
            Increase = costFormula.Increase,
            Created = costFormula.Created,
        };
    }
}