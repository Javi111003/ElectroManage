using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Query.CountDeletedCompanies;
public class CountDeleteCompaniesQueryHandler : CoreCommandHandler<CountDeletedCompaniesQuery, CountDeletedCompaniesResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CountDeleteCompaniesQueryHandler> _logger;

    public CountDeleteCompaniesQueryHandler(IUnitOfWork unitOfWork, ILogger<CountDeleteCompaniesQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CountDeletedCompaniesResponse> ExecuteAsync(CountDeletedCompaniesQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var companies = await companyRepository.GetAll(useInactive: true).ToListAsync();
        var companiesByMonth = new CountCreatedDeletedCompaniesByMonthDTO[12];
        for (int month = 0; month < 12; month++)
        {
            companiesByMonth[month] = new CountCreatedDeletedCompaniesByMonthDTO
            {
                Month = month + 1,
                CountCreatedCompanies = companies.Count(x => x.Created.Year == command.Year && x.Created.Month == month + 1),
                CountDeletedCompanies = companies.Count(x => x.LastModified != null && x.LastModified.Value.Year == command.Year && x.StatusBaseEntity == Domain.Enums.StatusEntityType.Inactive && x.LastModified.Value.Month == month + 1)
            };
        }
        var countCompaniesResponse = new CountDeletedCompaniesResponse
        {
            Year = command.Year,
            CreatedComapniesThisYear = companies.Count(x => x.Created.Year == command.Year),
            DeletedCompaniesThisYear = companies.Count(x => x.LastModified != null && x.LastModified.Value.Year == command.Year && x.StatusBaseEntity == Domain.Enums.StatusEntityType.Inactive),
            ExistingCompaniesThisYear = companies.Count(x => x.Created.Year <= command.Year && x.StatusBaseEntity != Domain.Enums.StatusEntityType.Inactive),
            CompaniesByMonth = companiesByMonth
        };
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return countCompaniesResponse;
    }
}
