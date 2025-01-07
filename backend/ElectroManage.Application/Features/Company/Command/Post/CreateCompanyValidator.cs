using FluentValidation;

namespace ElectroManage.Application.Features.Company.Command.Post;

public class CreateCompanyValidator : Validator<CreateCompanyCommand>
{
    public CreateCompanyValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The Company name cannot be empty");

        RuleFor(x => x.AreaId)
            .NotEmpty()
            .WithMessage("Each Company must be vinculated to an Administrative Area")
            .GreaterThan(0)
            .WithMessage("The Area Id, must be greater than 0");

        RuleFor(x => x.LocationId)
            .NotEmpty()
            .WithMessage("The company's Location cannot be empty")
            .GreaterThan(0)
            .WithMessage("The Location Id, must be greater than 0");

        RuleFor(x => x.InstallationTypeId)
            .NotEmpty()
            .WithMessage("Each Company must be vinculated to an Installation Type")
            .GreaterThan(0)
            .WithMessage("The Installation Type Id, must be greater than 0");

        RuleFor(x => x.EfficiencyPolicyId)
            .NotEmpty()
            .WithMessage("Each Company must have an Efficiency Policy assigned")
            .GreaterThan(0)
            .WithMessage("The Efficiency Policy Id, must be greater than 0");
    }
}
