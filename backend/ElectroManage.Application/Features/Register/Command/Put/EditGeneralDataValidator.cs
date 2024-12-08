using FluentValidation;

namespace ElectroManage.Application.Features.Register.Command.Put;

public class EditGeneralDataValidator : Validator<EditGeneralDataRegisterCommand>
{
    public EditGeneralDataValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Register id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Register id must be greater that 0");
    }
}
