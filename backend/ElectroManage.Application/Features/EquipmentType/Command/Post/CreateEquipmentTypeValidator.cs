using FluentValidation;

namespace ElectroManage.Application.Features.EquipmentType.Command.Post;
public class CreateEquipmentTypeValidator : Validator<CreateEquipmentTypeCommand>
{
    public CreateEquipmentTypeValidator()
    {
        RuleFor(x=>x.Name)
            .NotEmpty()
            .WithMessage("The equipment type's name cannot be empty");
    }
}