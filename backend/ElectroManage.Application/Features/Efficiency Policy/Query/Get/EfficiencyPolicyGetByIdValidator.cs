using FluentValidation;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Get;

public class EfficiencyPolicyGetByIdValidator : Validator<EfficiencyPolicyGetByIdCommand>
{
    public EfficiencyPolicyGetByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Policy id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Policy id must be greater than 0");
    }
}
