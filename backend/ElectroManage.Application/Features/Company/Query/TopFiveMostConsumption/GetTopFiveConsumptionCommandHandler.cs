
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.TopFiveMostConsumption;

public class GetTopFiveConsumptionCommandHandler : CoreCommandHandler<GetTopFiveMostConsumptionCommand, GetTopFiveMostConsumptionResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<GetTopFiveConsumptionCommandHandler> _logger;

    public GetTopFiveConsumptionCommandHandler(IUnitOfWork unitOfWork, ILogger<GetTopFiveConsumptionCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<GetTopFiveMostConsumptionResponse> ExecuteAsync(GetTopFiveMostConsumptionCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            c => c.Registers
        };
        var companies = await companyRepository.GetAll(useInactive: true, includes: include)
            .Select(x => new ConsumptionDTO
            {
                CompanyId = x.Id,
                TotalConsumption = x.Registers.Sum(r => r.Consumption)
            }).OrderBy(c => c.TotalConsumption).Take(5).ToListAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new GetTopFiveMostConsumptionResponse
        {
            TopFiveMostConsumption = companies
        };
    }
}
