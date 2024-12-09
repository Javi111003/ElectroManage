using FluentValidation;

namespace ElectroManage.Application.Features.EquipmentSpecification.Command.Post;

public class CreateEquipmentSpecificationValidator : Validator<CreateEquipmentSpecificationCommand>
{
    public CreateEquipmentSpecificationValidator()
    {
        RuleFor(x => x.EquipmentBrandId)
            .NotEmpty()
            .WithMessage("The Equipment's brand id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Equipment's brand id must be a positive value");

        RuleFor(x => x.EquipmentTypeId)
            .NotEmpty()
            .WithMessage("The Equipment's type id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Equipment's type id must be a positive value");

        RuleFor(x => x.Model)
            .NotEmpty()
            .WithMessage("The Equipment's model cannot be empty");

        RuleFor(x => x.Capacity)
            .GreaterThan(0)
            .WithMessage("The Equipment's capacity must be a positive value");

        RuleFor(x => x.AverageConsumption)
            .GreaterThanOrEqualTo(0)
            .WithMessage("The Equipment's average consumption must be a positive value");

        RuleFor(x => x.LifeSpanYears)
            .GreaterThanOrEqualTo(0)
            .WithMessage("The Equipment's lifespan must be a positive value");
            
        RuleFor(x => x.Efficiency)
            .GreaterThanOrEqualTo(0)
            .WithMessage("The Equipment's efficiency must be a positive value");
    }
}
