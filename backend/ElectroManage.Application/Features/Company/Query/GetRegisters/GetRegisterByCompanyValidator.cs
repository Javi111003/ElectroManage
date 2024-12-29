using FluentValidation;

namespace ElectroManage.Application.Features.Company.Query.GetRegisters;

public class GetRegisterByCompanyValidator : Validator<GetRegisterByCompanyCommand>
{
    public GetRegisterByCompanyValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Company Id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Company Id must be greater than 0");

        RuleFor(x => x.StartDate)
            .NotEmpty()
            .WithMessage("The start date cannot be empty");

        RuleFor(x => x.EndDate)
            .NotEmpty()
            .WithMessage("The End date cannot be empty");
    }
}
