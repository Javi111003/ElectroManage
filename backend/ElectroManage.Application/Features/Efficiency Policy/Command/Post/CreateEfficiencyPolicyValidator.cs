using FluentValidation;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Post;

internal class CreateEfficiencyPolicyValidator : Validator<CreateEfficienciPolicyCommand>
{
    public CreateEfficiencyPolicyValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The name of the policy cannot be empty");
    }
}
