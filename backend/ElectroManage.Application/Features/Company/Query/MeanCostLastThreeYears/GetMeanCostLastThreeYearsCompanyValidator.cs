using FluentValidation;

namespace ElectroManage.Application.Features.Company.Query.MeanCostLastThreeYears;

public class GetMeanCostLastThreeYearsCompanyValidator : Validator<GetMeanCostLastThreeYearsCompanysQuery>
{
    public GetMeanCostLastThreeYearsCompanyValidator()
    {
        RuleFor(x => x.CompanyIds)
            .Must(x => x.Count > 0)
            .WithMessage("At least one company is needed")
            .Must(AllPositives)
            .WithMessage("The Company's IDs must be greater than 0");
    }
    private bool AllPositives(ICollection<long> values)
    {
        return values != null && values.All(x => x > 0);
    }
}
