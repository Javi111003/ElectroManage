using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Query.ListAll;

public class ListCompanyQueryHandler : CoreQueryHandler<ListCompanyQuery, IEnumerable<CompanyResponse>>
{
    readonly ILogger<ListCompanyQueryHandler> _logger;
    readonly IUnitOfWork _unitOfWork;
    public ListCompanyQueryHandler(ILogger<ListCompanyQueryHandler> logger, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }
    public override async Task<IEnumerable<CompanyResponse>> ExecuteAsync(ListCompanyQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var companies = await companyRepository.GetAll(useInactive: false)
        .Include(x => x.AministrativeArea)
        .Include(x => x.InstalationType)
        .Include(x => x.Location)
        .Include(x => x.ManagementTeam)
        .Include(x => x.EfficiencyPoliciesApplyed)
        .ThenInclude(x => x.EfficiencyPolicy)
            .ToListAsync();
        var companiesResponses = companies.Select(x => CompanyMapper.ToResponse(x)).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return companiesResponses;
    }
}