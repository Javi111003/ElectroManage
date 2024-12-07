using FluentValidation;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Put;

public class EditEfficiencyPolicyValidator : Validator<EditEfficiencyPolicyCommand>
{
    public EditEfficiencyPolicyValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Policy id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Policy id must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The Policy name cannot be empty");
    }
}
