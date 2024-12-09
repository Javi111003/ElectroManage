using FluentValidation;

namespace ElectroManage.Application.Features.EquipmentBrand.Command.Put;

public class EditEquipmentBrandValidator : Validator<EditEquipmentBrandCommand>
{
    public EditEquipmentBrandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Equipment Brand Id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Equipment Brand Id must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The Equipment Brand Name cannot be empty");
    }
}
