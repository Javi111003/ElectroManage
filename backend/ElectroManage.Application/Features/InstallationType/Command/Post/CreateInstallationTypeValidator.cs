using FluentValidation;

namespace ElectroManage.Application.Features.InstallationType.Command.Post;

public class CreateInstallationTypeValidator : Validator<CreateInstallationTypeCommand>
{
    public CreateInstallationTypeValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The Installation name cannot be empty");
    }
}
