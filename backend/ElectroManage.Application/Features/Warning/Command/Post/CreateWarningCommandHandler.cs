
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Warning.Command.Post;

public class CreateWarningCommandHandler : CoreCommandHandler<CreateWarningCommand, CreateWarningResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateWarningCommandHandler> _logger;

    public CreateWarningCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateWarningCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CreateWarningResponse> ExecuteAsync(CreateWarningCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var warningRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Warning>();
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var company = await companyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.CompanyId);
        if (company is null)
        {
            _logger.LogError($"The company with id: {command.CompanyId} not found");
            ThrowError($"The company with id: {command.CompanyId} not found", 404);
        }
        var warning = new Domain.Entites.Sucursal.Warning
        {
            CompanyId = command.CompanyId,
            Company = company,
            Consumption = command.Consumption,
            EstablishedLimit = command.EstablishedLimit,
        };
        await warningRepository.SaveAsync(warning);
        company.Warnings.Add(warning);
        await companyRepository.UpdateAsync(company);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CreateWarningResponse
        {
            Id = warning.Id,
            CompanyName = warning.Company.Name,
            Consumption = warning.Consumption,
            EstablishedLimit = warning.EstablishedLimit
        };
    }
}
