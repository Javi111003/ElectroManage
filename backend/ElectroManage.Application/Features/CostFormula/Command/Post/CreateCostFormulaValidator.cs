using FluentValidation;

namespace ElectroManage.Application.Features.CostFormula.Command.Post;
public class CreateCostFormulaValidator : CoreValidator<CreateCostFormulaCommand>
{
    public CreateCostFormulaValidator()
    {
        RuleFor(p => p.CompanyId)
            .GreaterThan(0)
            .WithMessage("CompanyId must be greater than 0");
        RuleFor(p => p.Name)
            .NotNull()
            .NotEmpty()
            .WithMessage("Name must not be empty");
        RuleFor(p => p.Expression)
            .NotNull()
            .NotEmpty()
            .WithMessage("Expression must not be empty");
        RuleForEach(p => p.Variables)
            .Must(p => p.Value != null || p.Expression != null || p.VariableName.Equals("consumo", StringComparison.InvariantCultureIgnoreCase))
            .WithMessage("Variable must have a value or an expression as definition");
    }
}