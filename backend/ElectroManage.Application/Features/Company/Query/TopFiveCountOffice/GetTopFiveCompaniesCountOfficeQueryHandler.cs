using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.TopFiveCountOffice;
public class GetTopFiveCompaniesCountOfficeQueryHandler : CoreCommandHandler<GetTopFiveCompaniesCountOfficeQuery, IEnumerable<TopFiveCompanyCountOfficeDTO>>
{
    readonly ILogger<GetTopFiveCompaniesCountOfficeQueryHandler> _logger;
    public GetTopFiveCompaniesCountOfficeQueryHandler(IUnitOfWork unitOfWork, ILogger<GetTopFiveCompaniesCountOfficeQueryHandler> logger) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<IEnumerable<TopFiveCompanyCountOfficeDTO>> ExecuteAsync(GetTopFiveCompaniesCountOfficeQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Offices
        };
        var companies = await companyRepository.GetAll(useInactive: true, includes: include)
                .Select(x => new TopFiveCompanyCountOfficeDTO
                {
                    CompanyId = x.Id,
                    CompanyName = x.Name,
                    OfficeCount = x.Offices.Where(o => o.StatusBaseEntity != Domain.Enums.StatusEntityType.Delete).Count()
                })
            .Take(5).OrderBy(x => x.OfficeCount)
            .ToListAsync(ct);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return companies;
    }
}