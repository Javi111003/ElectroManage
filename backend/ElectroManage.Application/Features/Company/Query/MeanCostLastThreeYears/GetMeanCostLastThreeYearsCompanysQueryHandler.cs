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
        ICollection<ListMonthlastThreeYearsResponse> response = [];
        foreach (var id in command.CompanyIds)
        {
            var company = companyRepository.GetAllListOnly(useInactive: true, includes: companyInclude, filters: x => x.Id == id).FirstOrDefault();
            if (company is null)
            {
                _logger.LogInformation($"Company with id: {id} not found");
                ThrowError($"Company with id: {id} not found", 404);
            }
            int year = company.Created.Year - 1;
            ICollection<YearCostDTO> years = [];
            while (year > company.Created.Year - 4)
            {
                years.Add(new YearCostDTO
                {
                    Year = year,
                    MeanCost = company.Registers.Where(x => x.Created.Year == year).Sum(x => x.Cost) / 365,
                    MeanConsumption = company.Registers.Where(X => X.Created.Year == year).Sum(x => x.Consumption) / 365,
                });
                year--;
            }
            response.Add(new ListMonthlastThreeYearsResponse
            {
                CompanyID = id,
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
