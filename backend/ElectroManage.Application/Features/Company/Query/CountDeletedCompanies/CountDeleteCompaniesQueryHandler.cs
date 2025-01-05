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
        var countCompaniesResponse = new CountDeletedCompaniesResponse
        {
            CreatedComapniesThisYear = companies.Count(x => x.Created.Year == command.Year),
            DeletedCompaniesThisYear = companies.Count(x => x.LastModified != null && x.LastModified.Value.Year == command.Year && x.StatusBaseEntity == Domain.Enums.StatusEntityType.Inactive),
            ExistingCompaniesThisYear = companies.Count(x => x.Created.Year <= command.Year && x.StatusBaseEntity != Domain.Enums.StatusEntityType.Inactive),
        };
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return countCompaniesResponse;
    }
}
