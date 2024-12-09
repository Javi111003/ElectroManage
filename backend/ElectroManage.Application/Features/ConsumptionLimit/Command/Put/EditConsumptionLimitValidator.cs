using FluentValidation;

namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Put;

public class EditConsumptionLimitValidator : Validator<EditConsumptionLimitCommand>
{
    public EditConsumptionLimitValidator()
    {
        RuleFor(x => x.Limit)
            .GreaterThan(0)
            .WithMessage("The Consumption Limit must take a positive value.");
    }
}