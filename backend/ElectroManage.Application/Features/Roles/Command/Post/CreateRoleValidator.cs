using FluentValidation;

namespace ElectroManage.Application.Features.Roles.Command.Post;
public class CreateRoleValidator : CoreValidator<CreateRoleCommand>
{
    public CreateRoleValidator()
    {
            RuleFor(x => x.RoleName)
                .NotNull()
                .NotEmpty()
                .WithMessage("The roleName is required")
                .MinimumLength(4)
                .WithMessage("The minimum length for roleName is of 4 characters")
                .MaximumLength(12)
                .WithMessage("The maximum length for roleName is of 12 characters");
    }
}