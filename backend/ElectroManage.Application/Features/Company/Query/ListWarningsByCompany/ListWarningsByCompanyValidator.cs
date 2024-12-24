using FluentValidation;

namespace ElectroManage.Application.Features.Company.Query.ListWarningsByCompany;

public class ListWarningsByCompanyValidator : Validator<ListWarningsByCompanyCommand>
{
    public ListWarningsByCompanyValidator()
    {
        RuleFor(x => x.CompanyId)
            .NotEmpty()
            .WithMessage("The company Id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The company Id must be positive");
    }
}
