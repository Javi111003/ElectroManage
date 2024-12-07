using FluentValidation;

namespace ElectroManage.Application.Features.Administrative_Area.Command.Post;

public class CreateAdministrativeAreaValidator : Validator<CreateAdministrativeAreaCommand>
{
    public CreateAdministrativeAreaValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The Admnistrative Area name cannot be empty");
    }
}
