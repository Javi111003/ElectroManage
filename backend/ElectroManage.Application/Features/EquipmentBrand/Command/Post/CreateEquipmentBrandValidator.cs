using FluentValidation;

namespace ElectroManage.Application.Features.EquipmentBrand.Command.Post;
public class CreateEquipmentBrandValidator : Validator<CreateEquipmentBrandCommand>
{
    public CreateEquipmentBrandValidator()
    {
        RuleFor(x=>x.Name)
            .NotEmpty()
            .WithMessage("The equipment brand's name cannot be empty");
    }
}