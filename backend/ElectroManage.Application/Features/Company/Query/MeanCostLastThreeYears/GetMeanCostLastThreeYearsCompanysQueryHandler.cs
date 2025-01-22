using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.MeanCostLastThreeYears;
public class GetMeanCostLastThreeYearsCompanysQueryHandler : CoreCommandHandler<GetMeanCostLastThreeYearsCompanysQuery, IEnumerable<ListMonthlastThreeYearsDto>>
{
    readonly ILogger<GetMeanCostLastThreeYearsCompanysQueryHandler> _logger;
    public GetMeanCostLastThreeYearsCompanysQueryHandler(IUnitOfWork unitOfWork, ILogger<GetMeanCostLastThreeYearsCompanysQueryHandler> logger) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<IEnumerable<ListMonthlastThreeYearsDto>> ExecuteAsync(GetMeanCostLastThreeYearsCompanysQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var companyInclude = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Registers
        };
        var companies = await companyRepository.GetAllListOnly(useInactive: true, includes: companyInclude, filters: x => command.CompanyIds.Contains(x.Id))
            .ToListAsync();
        var notFound = command.CompanyIds.Except(companies.Select(x => x.Id));
        foreach (var id in notFound)
        {
            _logger.LogInformation($"Company with id: {id} not found");
            AddError(message: $"Company with id: {id} not found");
        }
        ThrowIfAnyErrors(404);
        List<ListMonthlastThreeYearsDto> response = [];
        foreach (var company in companies)
        {
            int year = DateTime.Now.Year - 1;
            List<YearCostDTO> years = [];
            while (year > DateTime.Now.Year - 4)
            {
                years.Add(new YearCostDTO
                {
                    Year = year,
                    MeanCost = company.Registers.Where(x => x.Date.Year == year).Sum(x => x.Cost) / 365,
                    MeanConsumption = company.Registers.Where(x => x.Date.Year == year).Sum(x => x.Consumption) / 365,
                });
                year -= 1;
            }
            response.Add(new ListMonthlastThreeYearsDto
            {
                CompanyID = company.Id,
                YearCostDto = years
            });
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        return response;
    }
}
