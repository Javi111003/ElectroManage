using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

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
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var company = await companyRepository.GetAllListOnly(filters: x => x.Id == command.CompanyId)
            .Include(c => c.CostFormulas)
                .ThenInclude(f => f.VariableDefinitions)
            .FirstAsync();
        if (company == null)
        {
            _logger.LogError($"The company with id: {command.CompanyId} not found");
            ThrowError($"The company with id: {command.CompanyId} not found", 404);
        }
        var formula = company.CostFormulas.Last();
        if (formula is null)
        {
            _logger.LogError($"The company with id: {command.CompanyId} does not have a cost formula");
            ThrowError($"The company with id: {command.CompanyId} does not have a cost formula", 404);
        }
        var cost = _costCalculator.EvaluateFormula(formula.Expression, []);//Pasar diccionario VariableName , Valor o Expresión
        var register = new Domain.Entites.Sucursal.Register
        {
            CompanyId = command.CompanyId,
            Company = company,
            Cost = cost,
            Consumption = command.Consumption,
            Date = DateTime.UtcNow,
        };
        await registerRepository.SaveAsync(register);
        company.Registers.Add(register);
        await companyRepository.UpdateAsync(company);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CreateRegisterResponse
        {
            Id = register.Id,
            CompanyName = company.Name,
            Consumption = register.Consumption,
            Cost = register.Cost,
            Date = register.Date,
        };
    }
}
