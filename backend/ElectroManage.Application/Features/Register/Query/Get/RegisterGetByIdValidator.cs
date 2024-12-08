using FluentValidation;

namespace ElectroManage.Application.Features.Register.Query.Get;

public class RegisterGetByIdValidator : Validator<RegisterGetByIdCommand>
{
    public RegisterGetByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Register id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Register id must be greater than 0");
    }
}
