using FluentValidation;

namespace ElectroManage.Application.Features.ManagementTeam.Command.CreateTeam;
public class CreateTeamValidator : CoreValidator<CreateTeamCommand>
{
    public CreateTeamValidator()
    {
        RuleFor(x => x.CompanyId)
            .NotNull()
            .NotEmpty()
            .WithMessage("Id is required")
            .GreaterThan(0)
            .WithMessage("Company Id is required");
        RuleFor(x => x.UserIds)
            .NotEmpty()
            .WithMessage("A team must be have a member as least")
            .Must(users => !users.Any(id => id <= 0))
            .WithMessage("User id must be greater than zero");
        RuleFor(x => x.Name)
            .MaximumLength(20).WithMessage("Maximum length for name is 20")
            .When(x => x.Name != null);
    }
}