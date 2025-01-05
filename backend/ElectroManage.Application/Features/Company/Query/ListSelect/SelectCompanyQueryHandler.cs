using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Query.ListSelect;

public class SelectCompanyQueryHandler : CoreQueryHandler<SelectCompanyQuery, IEnumerable<CompanyDTO>>
{
    readonly ILogger<SelectCompanyQueryHandler> _logger;
    public SelectCompanyQueryHandler(ILogger<SelectCompanyQueryHandler> logger, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<IEnumerable<CompanyDTO>> ExecuteAsync(SelectCompanyQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var companies = await companyRepository.GetAll(useInactive: false)
            .ToListAsync();
        var companiesDtos = companies.Select(c => new CompanyDTO
        {
            Id = c.Id,
            Name = c.Name ?? ""
        }).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return companiesDtos;
    }
}