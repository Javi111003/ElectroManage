using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.ListCompanyOverLimit;

public class ListCompanyOverLimitQueryHandler : CoreCommandHandler<ListCompanyOverLimitQuery, IEnumerable<CompanyOverLimitResponse>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListCompanyOverLimitQueryHandler> _logger;

    public ListCompanyOverLimitQueryHandler(IUnitOfWork unitOfWork, ILogger<ListCompanyOverLimitQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<CompanyOverLimitResponse>> ExecuteAsync(ListCompanyOverLimitQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var warningRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Warning>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Warning, object>>>
        {
            w => w.Company
        };
        var filter = new Expression<Func<Domain.Entites.Sucursal.Warning, bool>>[]
        {
            w => w.Created.Month == command.Date.Month && w.Created.Year == command.Date.Year,
        };
        var warnings = await warningRepository.GetAll(useInactive: true, includes: include, filters: filter)
        .ToListAsync(ct);
        
        var groupedWarnings = warnings.GroupBy(w => w.CompanyId);
        List<CompanyOverLimitResponse> response = [];
        foreach(var warning in groupedWarnings)
        {
            response.AddRange(warning.Select(w => ListWarningMapper.ToCompanyOverLimitResponse(w)));
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return response;
    }
}