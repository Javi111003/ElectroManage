using FluentValidation;

namespace ElectroManage.Application.Features.Administrative_Area.Command.Put;

public class EditAdministrativeAreaValidator : Validator<EditAdministrativeAreaCommand>
{
    public EditAdministrativeAreaValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Administrative Area Id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Administrative Area Id must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The Administrative Area Name cannot be empty");
    }
}
