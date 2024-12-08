using FluentValidation;
namespace ElectroManage.Application.Features.Register.Command.Post;

public class CreateRegisterValidator : Validator<CreateRegisterCommand>
{
    public CreateRegisterValidator()
    {
        RuleFor(x => x.CompanyId)
            .NotEmpty()
            .WithMessage("The company id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The company must be greater than 0");
    }
}