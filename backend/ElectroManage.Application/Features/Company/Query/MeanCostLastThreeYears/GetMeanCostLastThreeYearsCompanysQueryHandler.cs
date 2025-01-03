using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.MeanCostLastThreeYears;

public class GetMeanCostLastThreeYearsCompanysQueryHandler : CoreCommandHandler<GetMeanCostLastThreeYearsCompanysQuery, GetMeanCostLastThreeYearsCompanysResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<GetMeanCostLastThreeYearsCompanysQueryHandler> _logger;

    public GetMeanCostLastThreeYearsCompanysQueryHandler(IUnitOfWork unitOfWork, ILogger<GetMeanCostLastThreeYearsCompanysQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<GetMeanCostLastThreeYearsCompanysResponse> ExecuteAsync(GetMeanCostLastThreeYearsCompanysQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var companyInclude = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Registers
        };
        var companies = companyRepository.GetAll(useInactive: true, includes: companyInclude).Where(x => command.CompanyIds.Contains(x.Id));
        var notFound = command.CompanyIds.Except(companies.Select(x => x.Id));
        foreach (var id in notFound)
        {
            _logger.LogInformation($"Company with id: {id} not found");
            AddError(message: $"Company with id: {id} not found", errorCode: "404");
        }
        ThrowIfAnyErrors();
        List<ListMonthlastThreeYearsResponse> response = [];
        foreach (var company in companies)
        {
            int year = DateTime.Now.Year - 1;
            List<YearCostDTO> years = [];
            while (year > DateTime.Now.Year - 4)
            {
                years.Add(new YearCostDTO
                {
                    Year = year,
                    MeanCost = company.Registers.Where(x => x.Created.Year == year).Sum(x => x.Cost) / 365,
                    MeanConsumption = company.Registers.Where(X => X.Created.Year == year).Sum(x => x.Consumption) / 365,
                });
                year -= 1;
            }
            response.Add(new ListMonthlastThreeYearsResponse
            {
                CompanyID = company.Id,
                YearCostDto = years
            });
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        return new GetMeanCostLastThreeYearsCompanysResponse
        {
            Response = response
        };
    }
}
