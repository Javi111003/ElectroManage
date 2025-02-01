using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Register.Command.Post;
public class CreateRegisterCommandHandler : CoreCommandHandler<CreateRegisterCommand, CreateRegisterResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateRegisterCommandHandler> _logger;
    readonly ICostCalculator _costCalculator;
    public CreateRegisterCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateRegisterCommandHandler> logger, ICostCalculator costCalculator) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _costCalculator = costCalculator;
    }
    public override async Task<CreateRegisterResponse> ExecuteAsync(CreateRegisterCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var registerRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Register>();
        var formulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var company = await companyRepository.GetAllListOnly(filters: x => x.Id == command.CompanyId)
            .Include(c => c.Registers)
            .Include(c => c.CostFormulas)
                .ThenInclude(f => f.VariableDefinitions)
                .AsSplitQuery()
            .FirstOrDefaultAsync();
        if (company == null)
        {
            _logger.LogError($"The company with id: {command.CompanyId} not found");
            ThrowError($"The company with id: {command.CompanyId} not found", 404);
        }
        if (company.Registers.Count(r => r.Date.Date == command.Date.Date) > 0)
        {
            _logger.LogError($"You can only create one register by day");
            ThrowError($"You can only create one register by day", 400);
        }
        var formula = company.CostFormulas.LastOrDefault();
        if (formula is null)
        {
            _logger.LogError($"The company with id: {command.CompanyId} does not have a cost formula");
            ThrowError($"The company with id: {command.CompanyId} does not have a cost formula", 404);
        }
        var variables = formula.VariableDefinitions.ToList();
        variables.Add(new VariableDefinition
        {
            Name = "consumo",
            StaticValue = command.Consumption
        });
        var cost = _costCalculator.EvaluateFormula(formula.Expression, [.. variables]);
        await formulaRepository.UpdateAsync(formula, false);
        var register = new Domain.Entites.Sucursal.Register
        {
            CompanyId = command.CompanyId,
            Company = company,
            Cost = cost,
            Consumption = command.Consumption,
            Date = command.Date,
        };
        await registerRepository.SaveAsync(register, false);
        company.Registers.Add(register);
        await companyRepository.UpdateAsync(company, false);
        var consumption = company.Registers.Where(r => r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active
                                        && r.Date.Month == register.Date.Month
                                        && r.Date.Year == r.Date.Year)
                                        .Sum(r => r.Consumption);
        bool exceedLimit = consumption > Convert.ToDouble(company.ConsumptionLimit);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        await _unitOfWork.SaveChangesAsync();
        return new CreateRegisterResponse
        {
            Id = register.Id,
            CompanyName = company.Name,
            Consumption = register.Consumption,
            Cost = register.Cost,
            Date = register.Date,
            IsOverLimit = exceedLimit,
            WarningInfo = exceedLimit ? new WarningDTO
            {
                 Consumption = Convert.ToDecimal(consumption),
                 EstablishedLimit = company.ConsumptionLimit,
                 Month = register.Date.Month,
                 Year = register.Date.Year
            } : null
        };
    }
}
