
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.TopFiveCountOffice;

public class GetTopFiveCompaniesCountOfficeCommandHandler : CoreCommandHandler<GetTopFiveCompaniesCountOfficeCommand, GetTopFiveCompaniesCountOfficeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<GetTopFiveCompaniesCountOfficeCommandHandler> _logger;

    public GetTopFiveCompaniesCountOfficeCommandHandler(IUnitOfWork unitOfWork, ILogger<GetTopFiveCompaniesCountOfficeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<GetTopFiveCompaniesCountOfficeResponse> ExecuteAsync(GetTopFiveCompaniesCountOfficeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Offices
        };
        var companies = await companyRepository.GetAll(useInactive: true, includes: include)
            .Select(x => new TopFiveCompanyCountOfficeDTO
            {
                CompanyId = x.Id,
                CountOffice = x.Offices.Count()
            }).Take(5).OrderBy(x => x.CountOffice).ToListAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new GetTopFiveCompaniesCountOfficeResponse
        {
            TopFiveCompanyCounts = companies,
        };
    }
}