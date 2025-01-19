using FluentValidation;

namespace ElectroManage.Application.Features.AppUser.Command.Put;
public class EditAppUserValidator : Validator<EditAppUserCommand>
{
    public EditAppUserValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The User Id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The User Id must be greater than 0");

        RuleFor(x => x.CompanyId)
            .NotEmpty()
            .WithMessage("The Company Id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Company Id must be greater than 0");
    }
}