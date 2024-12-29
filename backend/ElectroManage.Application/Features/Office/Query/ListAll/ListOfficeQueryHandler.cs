using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Office.Query.ListAll;

public class ListOfficeQueryHandler : CoreQueryHandler<ListOfficeByCompanyQuery, IEnumerable<OfficeDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListOfficeQueryHandler> _logger;

    public ListOfficeQueryHandler(IUnitOfWork unitOfWork, ILogger<ListOfficeQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<OfficeDTO>> ExecuteAsync(ListOfficeByCompanyQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Offices
        };
        var company = await companyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.CompanyId, includes: include);
        if (company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {command.CompanyId} not found");
            ThrowError($"Company with id {command.CompanyId} not found", 404);
        }
        var offices = company.Offices.Select(x => new OfficeDTO
        {
            Id = x.Id,
            Name = x.Name,
            Description = x.Description,
            Company = new CompanyDTO { Id = company.Id, Name = company.Name}
        }).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return offices;
    }
}