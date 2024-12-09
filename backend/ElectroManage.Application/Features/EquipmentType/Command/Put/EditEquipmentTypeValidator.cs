using FluentValidation;

namespace ElectroManage.Application.Features.EquipmentType.Command.Put;

public class EditEquipmentTypeValidator : Validator<EditEquipmentTypeCommand>
{
    public EditEquipmentTypeValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Equipment Type Id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Equipment Type Id must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The Equipment Type Name cannot be empty");
    }
}
