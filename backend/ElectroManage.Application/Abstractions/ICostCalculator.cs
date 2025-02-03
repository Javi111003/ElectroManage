using ElectroManage.Domain.Entites.Sucursal;

namespace ElectroManage.Application.Abstractions;

/// <summary>
/// Provides functionality to evaluate cost formulas with variable inputs
/// </summary>
public interface ICostCalculator
{
    /// <summary>
    /// Evaluates a mathematical formula using the provided variables
    /// </summary>
    /// <param name="formula">The formula to evaluate, expressed as a string</param>
    /// <param name="variables">An array of variables to be used in the formula evaluation</param>
    /// <returns>The result of the formula evaluation as a double</returns>
    public double EvaluateFormula(string formula, params VariableDefinition[] variables);
}