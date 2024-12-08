using FluentValidation;

namespace ElectroManage.Application.Features.Warning.Command.Post;

public class CreateCompanyValidator : Validator<CreateWarningCommand>
{
    public CreateCompanyValidator()
    {
        RuleFor(x => x.CompanyId)
            .NotEmpty()
            .WithMessage("The company id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The company id must be greater than 0");

        RuleFor(x => x.EstablishedLimit)
            .NotEmpty()
            .WithMessage("Each alert needs a Limit")
            .GreaterThan(0)
            .WithMessage("The Limit must be greater than 0");
    }
}
