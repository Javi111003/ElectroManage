using FluentValidation;

namespace ElectroManage.Application.Features.EquipmentInstance.Command.Post;
public class CreateEquipmentInstanceValidator : Validator<CreateEquipmentInstanceCommand>
{
    public CreateEquipmentInstanceValidator()
    {
        RuleFor(x=>x.MaintenanceStatus)
            .NotEmpty()
            .WithMessage("The equipment's maintenance status cannot be empty");

        RuleFor(x=>x.UseFrequency)
            .NotEmpty()
            .WithMessage("The equipment's use frequency cannot be empty");
        
        RuleFor(x => x.EquipmentSpecificationId)
            .NotNull()
            .NotEmpty()
            .WithMessage("Equipment Specification Id is required")
            .GreaterThan(0)
            .WithMessage("Equipment's Specification Id must be greater than zero");
        
        RuleFor(x => x.OfficeId)
            .NotNull()
            .NotEmpty()
            .WithMessage("Office Id is required")
            .GreaterThan(0)
            .WithMessage("Office Id must be greater than zero");
    }
}