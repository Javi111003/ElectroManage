using FluentValidation;

namespace ElectroManage.Application.Features.Company.Query.CountDeleteCompanies;

public class CountDeleteCompaniesValidator : Validator<CountDeleteCompaniesCommand>
{
    public CountDeleteCompaniesValidator()
    {
        RuleFor(x => x.Year)
            .NotEmpty()
            .WithMessage("The year cannot be empty")
            .GreaterThan(2000)
            .WithMessage("The year must be greater than 2000")
            .LessThanOrEqualTo(DateTime.Now.Year)
            .WithMessage("The Data Base don't have data about this year");
    }
}
