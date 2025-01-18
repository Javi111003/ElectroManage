using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using NCalc;

namespace ElectroManage.Application.Services;

public class CostCalculator : ICostCalculator
{
    public double EvaluateFormula(string formula, Dictionary<string, double> variables)
    {
        var expression = new Expression(formula);

        foreach (var variable in variables)
        {
            expression.Parameters[variable.Key] = variable.Value;
        }
        return (double)expression.Evaluate();
    }
    private double EvaluateVariable(VariableDefinition variable, Dictionary<string, double> resolvedVariables)
    {
        if (variable.StaticValue.HasValue)
            return variable.StaticValue.Value;

        if (!string.IsNullOrEmpty(variable.Formula.Expression))
            return EvaluateFormula(variable.Formula.Expression, resolvedVariables);

        throw new Exception($"Variable {variable.Name} no tiene valor definido.");
    }
}