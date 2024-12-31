
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Query.CountDeleteCompanies;

public class CountDeleteCompaniesCommandHandler : CoreCommandHandler<CountDeleteCompaniesCommand, CountDeleteCompaniesResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CountDeleteCompaniesCommandHandler> _logger;

    public CountDeleteCompaniesCommandHandler(IUnitOfWork unitOfWork, ILogger<CountDeleteCompaniesCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CountDeleteCompaniesResponse> ExecuteAsync(CountDeleteCompaniesCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var companies = await companyRepository.GetAll(useInactive: true).ToListAsync();
        var countCompaniesResponse = new CountDeleteCompaniesResponse
        {
            CreatedComapniesThisYear = companies.Count(x => x.Created.Year == command.Year),
            DeletedCompaniesThisYear = companies.Count(x => x.LastModified!.Value.Year == command.Year && x.StatusBaseEntity == Domain.Enums.StatusEntityType.Inactive),
            ExistingCompaniesThisYear = companies.Count(x => x.Created.Year <= command.Year && x.StatusBaseEntity != Domain.Enums.StatusEntityType.Inactive),
        };
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return countCompaniesResponse;
    }
}
