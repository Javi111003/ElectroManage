using FluentValidation;

namespace ElectroManage.Application.Features.Location.Command.Post;

public class CreateLocationValidator : Validator<CreateLocationCommand>
{
    public CreateLocationValidator()
    {
        RuleFor(x => x.Coordenate.Latitude)
            .NotEmpty()
            .NotNull()
            .WithMessage("Latitude cannot be empty");

        RuleFor(x => x.Coordenate.Longitude)
            .NotEmpty()
            .NotNull()
            .WithMessage("Longitude cannot be empty");
    }
}