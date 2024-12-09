using FluentValidation;

namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Post;

public class CreateConsumptionLimitValidator : Validator<CreateConsumptionLimitCommand>
{
    public CreateConsumptionLimitValidator()
    {
        RuleFor(x => x.Limit)
            .GreaterThan(0)
            .WithMessage("The Consumption Limit must take a positive value.");
    }
}