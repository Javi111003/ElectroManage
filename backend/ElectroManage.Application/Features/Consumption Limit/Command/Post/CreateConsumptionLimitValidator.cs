using FluentValidation;

namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Post;
public class CreateConsumptionLimitValidator : Validator<CreateConsumptionLimitCommand>
{
    public CreateConsumptionLimitValidator()
    {
        RuleFor(x => x.CompanyId)
            .NotEmpty()
            .WithMessage("Each Consumption Limit must be vinculated to a Company")
            .GreaterThan(0)
            .WithMessage("The Company Id, must be greater than 0");
    }
}