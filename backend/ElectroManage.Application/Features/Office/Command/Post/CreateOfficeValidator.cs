

using FluentValidation;

namespace ElectroManage.Application.Features.Office.Command.Post;

public class CreateOfficeValidator : Validator<CreateOfficeCommand>
{
    public CreateOfficeValidator()
    {
        RuleFor(x => x.CompanyId)
            .NotEmpty()
            .WithMessage("The Company id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Company id must be greater than 0");
    }
}
