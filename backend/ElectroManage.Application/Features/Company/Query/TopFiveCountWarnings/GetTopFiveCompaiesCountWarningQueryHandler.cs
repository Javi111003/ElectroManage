using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.TopFiveCountWarnings;
public class GetTopFiveCompaiesCountWarningQueryHandler : CoreCommandHandler<GetTopFiveCompaiesCountWarningQuery, IEnumerable<TopFiveCompaniesCountWarningDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<GetTopFiveCompaiesCountWarningQueryHandler> _logger;

    public GetTopFiveCompaiesCountWarningQueryHandler(IUnitOfWork unitOfWork, ILogger<GetTopFiveCompaiesCountWarningQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }
    public override async Task<IEnumerable<TopFiveCompaniesCountWarningDTO>> ExecuteAsync(GetTopFiveCompaiesCountWarningQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Warnings
        };
        var topFiveCompaniesCountWarnings = await companyRepository.GetAll(useInactive: false, includes: include)
            .Select(x => new TopFiveCompaniesCountWarningDTO
            {
                Company = new CompanyDTO
                {
                    Id = x.Id,
                    Name = x.Name,
                },
                CountWarning = x.Warnings.Where(w => w.StatusBaseEntity != Domain.Enums.StatusEntityType.Delete).Count(),
            }).Take(5).OrderBy(x => x.CountWarning)
            .ToListAsync(ct);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return topFiveCompaniesCountWarnings;
    }
}