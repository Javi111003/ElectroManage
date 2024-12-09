using FluentValidation;

namespace ElectroManage.Application.Features.ManagementTeam.Command.UpdateTeam;
public class UpdateTeamValidator : CoreValidator<UpdateTeamCommand>
{
    public UpdateTeamValidator()
    {
        RuleFor(x => x.TeamId)
            .NotNull()
            .NotEmpty()
            .WithMessage("Team Id is required")
            .GreaterThan(0)
            .WithMessage("Team Id must be greater than zero");
        RuleFor(x => x.UserIds)
            .NotEmpty()
            .WithMessage("A team must have at least one member")
            .Must(users => !users.Any(id => id <= 0))
            .WithMessage("User id must be greater than zero");
        RuleFor(x => x.Name)
            .MaximumLength(20).WithMessage("Maximum length for name is 20")
            .When(x => x.Name != null);
    }
}