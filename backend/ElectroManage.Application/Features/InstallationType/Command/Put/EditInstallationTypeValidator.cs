using FluentValidation;

namespace ElectroManage.Application.Features.InstallationType.Command.Put;

public class EditInstallationTypeValidator : Validator<EditInstallationTypeCommand>
{
    public EditInstallationTypeValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Installation Id is requered")
            .GreaterThan(0)
            .WithMessage("The Installation Id must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The Name cannot be empty");
    }
}
