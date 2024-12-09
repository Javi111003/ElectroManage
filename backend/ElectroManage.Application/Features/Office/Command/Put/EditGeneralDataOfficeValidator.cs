using FluentValidation;

namespace ElectroManage.Application.Features.Office.Command.Put;

public class EditGeneralDataOfficeValidator : Validator<EditGeneralDataOfficeCommand>
{
    public EditGeneralDataOfficeValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Office id cannot be empty")
            .GreaterThan(0)
            .WithMessage("Office id must be greater than 0");
    }
}
