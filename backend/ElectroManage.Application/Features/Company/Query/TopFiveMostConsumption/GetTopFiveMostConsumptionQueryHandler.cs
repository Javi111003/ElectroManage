using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.TopFiveMostConsumption;
public class GetTopFiveMostConsumptionQueryHandler : CoreCommandHandler<GetTopFiveMostConsumptionQuery, IEnumerable<ConsumptionDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<GetTopFiveMostConsumptionQueryHandler> _logger;

    public GetTopFiveMostConsumptionQueryHandler(IUnitOfWork unitOfWork, ILogger<GetTopFiveMostConsumptionQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }
    public override async Task<IEnumerable<ConsumptionDTO>> ExecuteAsync(GetTopFiveMostConsumptionQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            c => c.Registers
        };
        var companies = await companyRepository.GetAll(useInactive: false, includes: include)
            .Select(x => new ConsumptionDTO
            {
                CompanyId = x.Id,
                CompanyName = x.Name,
                ConsumptionLimit = x.ConsumptionLimit,
                TotalConsumption = x.Registers.Where(r => r.StatusBaseEntity != Domain.Enums.StatusEntityType.Delete).Sum(r => r.Consumption)
            }).OrderByDescending(c => c.TotalConsumption).Take(5)
            .ToListAsync(ct);
        return companies;
    }
}