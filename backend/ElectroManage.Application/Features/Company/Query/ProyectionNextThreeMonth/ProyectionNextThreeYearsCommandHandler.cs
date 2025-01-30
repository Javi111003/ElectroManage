using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.ProyectionNextThreeMonth;

public class ProyectionNextThreeYearsCommandHandler : CoreCommandHandler<ProyectionNextThreeMonthCommand, IEnumerable<ProyectionNextThreeMonthResponse>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ProyectionNextThreeYearsCommandHandler> _logger;
    readonly IProyectionService _proyectionService;

    public ProyectionNextThreeYearsCommandHandler(IUnitOfWork unitOfWork, ILogger<ProyectionNextThreeYearsCommandHandler> logger, IProyectionService proyectionService)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _proyectionService = proyectionService;
    }

    public override async Task<IEnumerable<ProyectionNextThreeMonthResponse>> ExecuteAsync(ProyectionNextThreeMonthCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            c => c.Registers
        };
        var companies = await companyRepository.GetAllListOnly(useInactive: true, includes: include, filters: x => command.CompaniesId.Contains(x.Id))
            .ToListAsync();
        var notFound = command.CompaniesId.Except(companies.Select(x => x.Id));
        foreach (var id in notFound)
        {
            _logger.LogInformation($"Company with id: {id} not found");
            AddError(message: $"Company with id: {id} not found");
        }
        ThrowIfAnyErrors(404);
        var response = new List<ProyectionNextThreeMonthResponse>();
        foreach (var company in companies)
        {
            if(company.Registers.Count > 0)
                response.Add(new ProyectionNextThreeMonthResponse
                {
                    CompanyId = company.Id,
                    Proyections = _proyectionService.CalculateProyectionsAsync(company).Result
                });
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return response;
    }
}
