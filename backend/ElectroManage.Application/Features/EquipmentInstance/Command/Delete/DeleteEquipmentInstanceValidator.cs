using FluentValidation;

namespace ElectroManage.Application.Features.EquipmentInstance.Command.Delete;
public class DeleteEquipmentInstanceValidator : Validator<DeleteEquipmentInstanceCommand>
{
    public DeleteEquipmentInstanceValidator()
    {
        RuleFor(x=>x.Id)
            .NotEmpty()
            .NotNull()
            .WithMessage("The equipment instance's Id is required")
            .GreaterThan(0)
            .WithMessage("The equipment instance Id must be greater than zero");
    }
}