using Bogus.DataSets;
using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Register.Command.Put;
public class EditGeneralDataRegisterCommandHandler : CoreCommandHandler<EditGeneralDataRegisterCommand, EditGeneralDataRegisterResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditGeneralDataRegisterCommandHandler> _logger;
    readonly ICostCalculator _costCalculator;
    public EditGeneralDataRegisterCommandHandler(IUnitOfWork unitOfWork, ILogger<EditGeneralDataRegisterCommandHandler> logger, ICostCalculator costCalculator) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _costCalculator = costCalculator;
    }
    public override async Task<EditGeneralDataRegisterResponse> ExecuteAsync(EditGeneralDataRegisterCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution starter");
        var registerRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Register>();
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var formulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();
        //var register = await registerRepository.GetAllListOnly(useInactive: true, filters: x => x.Id == command.Id)
        //    .Include(r => r.Company)
        //    .FirstOrDefaultAsync();
        //if (register is null)
        //{
        //    _logger.LogError($"The register with the id: {command.Id} not found");
        //    ThrowError($"The register with the id: {command.Id} not found", 404);
        //}
        var company = await companyRepository.GetAllListOnly(filters: x => x.Registers.Any(register => register.Id == command.Id))
            .Include(c => c.Registers)
            .Include(c => c.CostFormulas)
                .ThenInclude(f => f.VariableDefinitions)
                    .AsSplitQuery()
                    .FirstOrDefaultAsync();
        if (company is null)
        {
            _logger.LogError("Company not found");
            ThrowError("Company not found", 404);
        }
        var register = company.Registers.FirstOrDefault(r => r.Id == command.Id);
        if (register is null)
        {
            _logger.LogError($"The register with the id: {command.Id} not found");
            ThrowError($"The register with the id: {command.Id} not found", 404);
        }
        var formula = company.CostFormulas.LastOrDefault();
        if (formula is null)
        {
            _logger.LogError($"The company with id: {register.CompanyId} does not have a cost formula");
            ThrowError($"The company with id: {register.CompanyId} does not have a cost formula", 404);
        }
        var variables = formula.VariableDefinitions.ToList();
        variables.Add(new VariableDefinition
        {
            Name = "consumo",
            StaticValue = command.Consumption
        });
        var consumptionBefore = company.Registers.Where(r => r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active
                        && r.Date.Month == register.Date.Month
                        && r.Date.Year == r.Date.Year)
                        .Sum(r => r.Consumption);
        var cost = _costCalculator.EvaluateFormula(formula.Expression, [.. variables]);
        await formulaRepository.UpdateAsync(formula, false);
        register.Consumption = command.Consumption;
        register.Cost = cost;
        register.Date = command.Date;
        await registerRepository.UpdateAsync(register, false);
        await companyRepository.UpdateAsync(company, false);
        await _unitOfWork.SaveChangesAsync();
        var consumption = company.Registers.Where(r => r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active
                                && r.Date.Month == register.Date.Month
                                && r.Date.Year == r.Date.Year)
                                .Sum(r => r.Consumption);
        bool exceedLimit = consumptionBefore < consumption && consumption > Convert.ToDouble(company.ConsumptionLimit);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new EditGeneralDataRegisterResponse
        {
            Id = register.Id,
            Cost = register.Cost,
            Consumption = register.Consumption,
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