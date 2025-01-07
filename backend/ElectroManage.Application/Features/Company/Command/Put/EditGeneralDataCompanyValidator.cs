using FluentValidation;

namespace ElectroManage.Application.Features.Company.Command.Put;

public class EditGeneralDataCompanyValidator : Validator<EditGeneralDataCompanyCommand>
{
    public EditGeneralDataCompanyValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("The Company id cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Company id must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The company name cannot be empty");
        
        RuleFor(x => x.AreaId)
            .GreaterThan(0)
            .WithMessage("The Area id must be greater than 0");

        RuleFor(x => x.InstallationTypeId)
            .GreaterThan(0)
            .WithMessage("The Area id must be greater than 0");

        RuleFor(x => x.LocationId)
            .GreaterThan(0)
            .WithMessage("The Area id must be greater than 0");
        RuleFor(x => x.EfficiencyPolicyId)
            .GreaterThan(0)
            .WithMessage("The Efficiency Policy id must be greater than 0");
    }
}
