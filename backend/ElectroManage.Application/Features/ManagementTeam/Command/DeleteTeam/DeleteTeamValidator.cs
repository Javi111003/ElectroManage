using FluentValidation;

namespace ElectroManage.Application.Features.ManagementTeam.Command.DeleteTeam;
public class DeleteTeamValidator : CoreValidator<DeleteTeamCommand>
{
    public DeleteTeamValidator()
    {
        RuleFor(x => x.TeamId)
            .NotNull()
            .NotEmpty()
            .WithMessage("Team Id is required")
            .GreaterThan(0)
            .WithMessage("Team Id must be greater than zero");
        RuleFor(x => x.CompanyId)
            .NotNull()
            .NotEmpty()
            .WithMessage("Company Id is required")
            .GreaterThan(0)
            .WithMessage("Company Id must be greater than zero");
    }
}
