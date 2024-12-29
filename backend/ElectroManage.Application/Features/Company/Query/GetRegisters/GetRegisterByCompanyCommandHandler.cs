using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.GetRegisters;

public class GetRegisterByCompanyCommandHandler : CoreCommandHandler<GetRegisterByCompanyCommand, GetRegisterByCompanyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<GetRegisterByCompanyCommandHandler> _logger;

    public GetRegisterByCompanyCommandHandler(IUnitOfWork unitOfWork, ILogger<GetRegisterByCompanyCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<GetRegisterByCompanyResponse> ExecuteAsync(GetRegisterByCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Registers,
        };
        var company = await companyRepository.FirstAsync(useInactive: true, includes: include, filters: x => x.Id == command.Id);
        if (company is null)
        {
            _logger.LogError($"Company with id {command.Id} not found");
            ThrowError($"Company with id {command.Id} not found", 404);
        }
        if (command.EndDate < command.StartDate)
        {
            _logger.LogError($"Invalid dates");
            ThrowError($"Invalid dates", 400);
        }
        var registers = company.Registers.Where(x => x.Date <= command.EndDate && x.Date >= command.StartDate);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new GetRegisterByCompanyResponse
        {
            Id = company.Id,
            Registers = registers.Select(r => new DTO_s.RegisterDTO
            {
                Date = r.Date,
                Consumption = r.Consumption,
                Cost = r.Cost,
            })
        };
    }
}
