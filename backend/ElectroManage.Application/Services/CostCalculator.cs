using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;
using NCalc;

namespace ElectroManage.Application.Services;

public class CostCalculator : ICostCalculator
{
    readonly IUnitOfWork _unitOfWork;
    public CostCalculator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    public double EvaluateFormula(string formula, params VariableDefinition[] variables)
    {
        _unitOfWork.BeginTransaction();
        var variableRepo = _unitOfWork.DbRepository<VariableDefinition>();
        var expression = new Expression(formula);
        foreach (var variable in variables)
        {
            expression.Parameters[variable.Name] = EvaluateVariable(variable, variableRepo);
        }
        try
        {
            var result = Convert.ToDouble(expression.Evaluate());
            _unitOfWork.CommitTransaction();
            return result;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error during formula: \" {formula} \" evaluation.\n \nError Message: {ex.Message}");
        }
    }
    private double EvaluateVariable(VariableDefinition variable, IGenericCoreRepository<VariableDefinition> repo)
    {
        if (variable.StaticValue.HasValue)
        {
            return variable.StaticValue.Value;
        }
        if (!string.IsNullOrEmpty(variable.Formula.Expression))
        {
            try
            {
                var value = Convert.ToDouble(new Expression(variable.Expression).Evaluate());
                if (!variable.Name.Equals("consumo", StringComparison.InvariantCultureIgnoreCase)) 
                { 
                    variable.StaticValue = value;
                    repo.Update(variable, false);
                }
                return value;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error during variable: {variable.Name} evaluation\n \nError Message: {ex.Message}");
            }
        }
        throw new Exception($"Variable {variable.Name} no tiene valor definido.");
    }
    /*public double RecursiveEvaluator(string formula, VariableDefinition[] variables)
    {
        return RecursiveEvaluatorAux(formula, variables, new bool[variables.Length], []);
    }
    private double RecursiveEvaluatorAux(string formula, VariableDefinition[] variables, bool[] pendingMask , Dictionary<string, double> resolved)
    {
        var Expression = new Expression(formula);
        for(int i = 0; i< variables.Length; i++)
        {
            var current = variables[i];
            if (!pendingMask[i])
            {
                if (current.StaticValue.HasValue) 
                {
                    resolved[current.Name] = current.StaticValue.Value; 
                    return current.StaticValue.Value;
                }
                if (!string.IsNullOrEmpty(current.Expression))
                {
                    pendingMask[i] = true;
                    return RecursiveEvaluatorAux(current.Expression, variables, pendingMask, resolved);
                }
            }
        }
    }*/
}