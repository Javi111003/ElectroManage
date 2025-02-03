using ElectroManage.Domain.Entites.Sucursal;

namespace ElectroManage.Application.Abstractions;
/// <summary>
/// Interface for calculating costs based on a given formula and variables.
/// </summary>
public interface ICostCalculator
{
    /// <summary>
    /// Evaluates a cost formula using the provided variables.
    /// </summary>
    /// <param name="formula">The formula to evaluate.</param>
    /// <param name="variables">An array of variables to be used in the formula.</param>
    /// <returns>The result of the formula evaluation as a double.</returns>
    public double EvaluateFormula(string formula, params VariableDefinition[] variables);
}