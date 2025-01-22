using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.ListRegistersByCompany;

public class ListRegistersByCompanyCommandHandler : CoreCommandHandler<ListRegistersByCompanyCommand, ListRegisterByCompanyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListRegistersByCompanyCommandHandler> _logger;

    public ListRegistersByCompanyCommandHandler(IUnitOfWork unitOfWork, ILogger<ListRegistersByCompanyCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<ListRegisterByCompanyResponse> ExecuteAsync(ListRegistersByCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            c => c.Registers
        };
        var company = await companyRepository.FirstAsync(includes: include, filters: c => c.Id == command.Id);
        if (company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with Id {command.Id} not found");
            ThrowError("Company with Id {command.Id} not found", 404);
        }
        var registers = company.Registers.Where(r => r.Date.Date >= command.Start.Date && r.Date.Date <= command.End.Date && r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active)
            .Select(r => new RegisterDTO
        {
            Id = r.Id,
            Date = r.Date,
            Cost = r.Cost,
            Consumption = r.Consumption,
        }).OrderByDescending(r => r.Date);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new ListRegisterByCompanyResponse
        {
            TotalCost = registers.Sum(r => r.Cost),
            TotalConsumption = registers.Sum(r => r.Consumption),
            Registers = registers
        };
    }
}
