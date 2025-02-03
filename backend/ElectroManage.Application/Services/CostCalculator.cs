using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using NCalc;

namespace ElectroManage.Application.Services;

/// <summary>
/// Service for calculating costs based on formulas and variable definitions.
/// </summary>
public class CostCalculator : ICostCalculator
{
    readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="CostCalculator"/> class with the specified unit of work.
    /// </summary>
    /// <param name="unitOfWork">The unit of work to be used for database transactions.</param>
    public CostCalculator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Evaluates a formula using the provided variables.
    /// </summary>
    /// <param name="formula">The formula to evaluate.</param>
    /// <param name="variables">The variables to use in the formula.</param>
    /// <returns>The result of the formula evaluation as a double.</returns>
    /// <exception cref="Exception">Thrown when an error occurs during formula evaluation.</exception>
    public double EvaluateFormula(string formula, params VariableDefinition[] variables)
    {
        _unitOfWork.BeginTransaction(); // Begin a database transaction
        var variableRepo = _unitOfWork.DbRepository<VariableDefinition>(); // Get the repository for VariableDefinition
        var expression = new Expression(formula); // Create a new NCalc expression with the formula

        // Set the parameters for the expression using the provided variables
        foreach (var variable in variables)
        {
            expression.Parameters[variable.Name] = EvaluateVariable(variable, variableRepo);
        }

        try
        {
            // Evaluate the expression and commit the transaction
            var result = Convert.ToDouble(expression.Evaluate());
            _unitOfWork.CommitTransaction();
            return result;
        }
        catch (Exception ex)
        {
            // Handle any exceptions that occur during evaluation
            throw new Exception($"Error during formula: \" {formula} \" evaluation.\n \nError Message: {ex.Message}");
        }
    }

    /// <summary>
    /// Evaluates a single variable, potentially updating its static value in the repository.
    /// </summary>
    /// <param name="variable">The variable to evaluate.</param>
    /// <param name="repo">The repository for updating the variable's static value.</param>
    /// <returns>The evaluated value of the variable as a double.</returns>
    /// <exception cref="Exception">Thrown when an error occurs during variable evaluation or if the variable has no defined value.</exception>
    private double EvaluateVariable(VariableDefinition variable, IGenericCoreRepository<VariableDefinition> repo)
    {
        // Return the static value if it exists
        if (variable.StaticValue.HasValue)
        {
            return variable.StaticValue.Value;
        }

        // Evaluate the variable's expression if it exists
        if (!string.IsNullOrEmpty(variable.Formula.Expression))
        {
            try
            {
                var value = Convert.ToDouble(new Expression(variable.Expression).Evaluate());

                // Update the static value in the repository if the variable is not "consumo"
                if (!variable.Name.Equals("consumo", StringComparison.InvariantCultureIgnoreCase)) 
                { 
                    variable.StaticValue = value;
                    repo.Update(variable, false);
                }
                return value;
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during variable evaluation
                throw new Exception($"Error during variable: {variable.Name} evaluation\n \nError Message: {ex.Message}");
            }
        }

        // Throw an exception if the variable has no defined value
        throw new Exception($"Variable {variable.Name} no tiene valor definido.");
    }
}