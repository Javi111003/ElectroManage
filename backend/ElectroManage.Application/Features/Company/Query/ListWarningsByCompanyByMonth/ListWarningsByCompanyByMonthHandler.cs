using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.ListWarningsByCompanyByMonth;

public class ListWarningsByCompanyByMonthHandler : CoreCommandHandler<ListWarningsByCompanyByMonthCommand, IEnumerable<CountWarningByMonthDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListWarningsByCompanyByMonthHandler> _logger;

    public ListWarningsByCompanyByMonthHandler(IUnitOfWork unitOfWork, ILogger<ListWarningsByCompanyByMonthHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<CountWarningByMonthDTO>> ExecuteAsync(ListWarningsByCompanyByMonthCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companies = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            c => c.Warnings
        };
        var company = await companies.FirstAsync(includes: include, filters: c => c.Id == command.CompanyId);
        if (company is null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {command.CompanyId}");
            ThrowError($"{nameof(ExecuteAsync)} | Company with id {command.CompanyId}", 404);
        }
        if(command.Year == null) command.Year = DateTime.Now.Year;
        var warnings = new CountWarningByMonthDTO[12];
        for (int month = 0; month < 12; month++)
        {
            warnings[month] = new CountWarningByMonthDTO
            {
                Month = month + 1,
                CountWarnings = company.Warnings.Count(w => w.Created.Year == command.Year && w.Created.Month == month + 1)
            };
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return warnings;
    }
}
