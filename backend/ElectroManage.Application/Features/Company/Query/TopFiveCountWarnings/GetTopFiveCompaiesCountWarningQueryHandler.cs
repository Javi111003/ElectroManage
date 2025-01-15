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
        var companies = await companyRepository.GetAll(includes: include).ToListAsync();
        var topFive = new List<TopFiveCompaniesCountWarningDTO>();
        foreach (var company in companies)
        {
            var warnings = new CountWarningByMonthDTO[12];
            for (int month = 0; month < 12; month++)
            {
                warnings[month] = new CountWarningByMonthDTO
                {
                    Month = month + 1,
                    CountWarnings = company.Warnings.Count(w => w.Created.Year == command.Year && w.Created.Month == month + 1)
                };
            }
            topFive.Add(new TopFiveCompaniesCountWarningDTO
            {
                Company = new CompanyDTO
                {
                    Id = company.Id,
                    Name = company.Name,
                },
                CountWarning = company.Warnings.Count(),
                CountWarningByMonth = warnings
            });
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return topFive.OrderByDescending(tp => tp.CountWarning).Take(5);
    }
}