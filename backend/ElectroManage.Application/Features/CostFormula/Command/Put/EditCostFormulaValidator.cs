using FluentValidation;

namespace ElectroManage.Application.Features.CostFormula.Command.Put;
public class EditCostFormulaValidator : CoreValidator<EditCostFormulaCommand>
{
    public EditCostFormulaValidator()
    {
        RuleFor(p => p.CompanyId)
            .GreaterThan(0)
            .WithMessage("CompanyId must be greater than 0");
        RuleFor(p => p.Expression)
            .NotNull()
            .NotEmpty()
            .WithMessage("Expression must not be empty");
        RuleForEach(p => p.Variables)
            .Must(p => p.Expression != null || p.VariableName.Equals("consumo", StringComparison.InvariantCultureIgnoreCase))
            .WithMessage("Variable must have a value or an expression as definition");
    }
}