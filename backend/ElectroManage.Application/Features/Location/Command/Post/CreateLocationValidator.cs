using FluentValidation;

namespace ElectroManage.Application.Features.Location.Command.Post;

public class CreateLocationValidator : Validator<CreateLocationCommand>
{
    public CreateLocationValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The Location name cannot be empty");

        RuleFor(x => x.ZipCode)
            .NotEmpty()
            .WithMessage("The Zip Code cannot be empty")
            .GreaterThanOrEqualTo(100000)
            .WithMessage("Invalid Zip Code")
            .LessThanOrEqualTo(999999)
            .WithMessage("Invalid Zip Code");
    }
}
