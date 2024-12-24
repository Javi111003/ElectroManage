using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Post;

public class CreateConsumptionLimitCommandHandler : CoreCommandHandler<CreateConsumptionLimitCommand, CreateConsumptionLimitResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateConsumptionLimitCommandHandler> _logger;

    public CreateConsumptionLimitCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateConsumptionLimitCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CreateConsumptionLimitResponse> ExecuteAsync(CreateConsumptionLimitCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        
        var consumptionLimitRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.ConsumptionLimit>();
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var includes = new List<Expression<Func<Domain.Entites.Sucursal.Company,object>>>
        {
            x => x.ConsumptionLimits
        };
    
        var company = await companyRepository.FirstAsync(useInactive: true, includes: includes, filters: x => x.Id == command.CompanyId);
        if (company is null)
        {
            _logger.LogError($"Company with id: {command.CompanyId} not found");
            ThrowError($"Company with id: {command.CompanyId} not found", 404);
        }
        foreach (var cl in company.ConsumptionLimits)
        {
            if(cl.Limit == command.Limit)
            {
                _logger.LogError($"Company with id: {command.CompanyId} already contains a limit with value {command.Limit}, limit_Id : {cl.Id} ");
                ThrowError($"Company with id: {command.CompanyId} already contains a limit with value {command.Limit}, limit_Id : {cl.Id} " , 404);
            }   
        }
        var consumptionLimit = new Domain.Entites.Sucursal.ConsumptionLimit
        {
            Limit = command.Limit,
            CompanyId = command.CompanyId,
            Company = company,
            ApplyingDate = DateTime.UtcNow
        };
        await consumptionLimitRepository.SaveAsync(consumptionLimit , false);
        company.ConsumptionLimits.Add(consumptionLimit);
        await companyRepository.UpdateAsync(company , false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new CreateConsumptionLimitResponse
        {
            Id = consumptionLimit.Id,
            Limit = consumptionLimit.Limit,
            CompanyId = consumptionLimit.CompanyId,
            CompanyName = company.Name,
            Created = DateTime.UtcNow
        };
    }
}