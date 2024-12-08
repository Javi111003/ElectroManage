
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Register.Command.Post;

public class CreateRegisterCommandHandler : CoreCommandHandler<CreateRegisterCommand, CreateRegisterResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateRegisterCommandHandler> _logger;

    public CreateRegisterCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateRegisterCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CreateRegisterResponse> ExecuteAsync(CreateRegisterCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var registerRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Register>();
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();

        var company = await companyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.CompanyId);
        if (company == null)
        {
            _logger.LogError($"The company with id: {command.CompanyId} not found");
            ThrowError($"The company with id: {command.CompanyId} not found", 404);
        }

        var register = new Domain.Entites.Sucursal.Register
        {
            CompanyId = command.CompanyId,
            Company = company,
            Cost = command.Cost,
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
