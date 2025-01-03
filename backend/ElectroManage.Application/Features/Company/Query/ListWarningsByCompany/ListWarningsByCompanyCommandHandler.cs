
using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.ListWarningsByCompany;

public class ListWarningsByCompanyCommandHandler : CoreCommandHandler<ListWarningsByCompanyCommand, ListWarningsByCompanyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListWarningsByCompanyCommandHandler> _logger;

    public ListWarningsByCompanyCommandHandler(IUnitOfWork unitOfWork, ILogger<ListWarningsByCompanyCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<ListWarningsByCompanyResponse> ExecuteAsync(ListWarningsByCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Warnings
        };
        var company = await companyRepository.FirstAsync(useInactive: true, includes: include, filters: x => x.Id == command.CompanyId);
        if (company is null)
        {
            _logger.LogError($"Company with id {command.CompanyId} not found");
            ThrowError($"Company with id {command.CompanyId} not found", 404);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return ListWarningMapper.ToResponse(company);
    }
}
