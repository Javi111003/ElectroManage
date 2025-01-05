using FluentValidation;

namespace ElectroManage.Application.Features.Location.Command.Put;
public class EditGeneralDataLocationValidator : CoreValidator<EditGeneralDataLocationCommand>
{
    public EditGeneralDataLocationValidator()
    {
        RuleFor(x => x.Id)
            .NotNull()
            .NotEmpty()
            .WithMessage("Location Id is required")
            .GreaterThan(0)
            .WithMessage("Location Id must be greater than zero");

        RuleFor(x => x.Longitude)
            .NotEmpty()
            .NotNull()
            .WithMessage("Longitude is required");

        RuleFor(x => x.Latitude)
            .NotEmpty()
            .NotNull()
            .WithMessage("Latitude is required");
    }
}