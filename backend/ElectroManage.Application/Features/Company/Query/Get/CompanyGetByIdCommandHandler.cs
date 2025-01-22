
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using ElectroManage.Application.DTO_s;
using Microsoft.EntityFrameworkCore;

namespace ElectroManage.Application.Features.Company.Query.Get;

public class CompanyGetByIdCommandHandler : CoreCommandHandler<CompanyGetByIdCommand, CompanyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CompanyGetByIdCommandHandler> _logger;

    public CompanyGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<CompanyGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CompanyResponse> ExecuteAsync(CompanyGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var company = await companyRepository.GetAllListOnly(filters: x => x.Id == command.Id)
        .Include(x => x.AministrativeArea)
        .Include(x => x.InstalationType)
        .Include(x => x.Location)
        .Include(x => x.ManagementTeam)
            .ThenInclude(x => x.Members)
        .Include(x => x.CostFormulas)
            .ThenInclude(x => x.VariableDefinitions)
                .AsSplitQuery()
        .Include(x => x.EfficiencyPoliciesApplyed)
            .ThenInclude(x => x.EfficiencyPolicy)
        .FirstOrDefaultAsync();
        
        if (company is null)
        {
            _logger.LogInformation($"Company with id: {command.Id} not found");
            ThrowError($"Company with id: {command.Id} not found", 404);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Mappers.CompanyMapper.ToResponse(company);
    }
}
