using FluentValidation;

namespace ElectroManage.Application.Features.EquipmentInstance.Command.Put;

public class EditEquipmentInstanceValidator : Validator<EditEquipmentInstanceCommand>
{
    public EditEquipmentInstanceValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Equipment Id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Equipment Id must be greater than 0");

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
