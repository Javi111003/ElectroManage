using FluentValidation;

namespace ElectroManage.Application.Features.InstallationType.Query.Get;

public class InstallationTypeGetByIdValidator : Validator<InstallationTypeGetByIdCommand>
{
    public InstallationTypeGetByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The installation type id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The installation type id must be greater than 0");
            
    }
}
