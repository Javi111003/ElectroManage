using FluentValidation;

namespace ElectroManage.Application.Features.ManagementTeam.Query.GetTeamByCompany;
public class GetTeamByCompanyValidator : CoreValidator<GetTeamByCompanyQuery>
{
    public GetTeamByCompanyValidator()
    {
        RuleFor(x => x.CompanyId)
            .NotNull()
            .NotEmpty()
            .WithMessage("Company Id is required")
            .GreaterThan(0)
            .WithMessage("Company Id must be greater than zero");
    }
}