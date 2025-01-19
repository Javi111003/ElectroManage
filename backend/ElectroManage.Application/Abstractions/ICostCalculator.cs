using ElectroManage.Domain.Entites.Sucursal;

namespace ElectroManage.Application.Abstractions;
public interface ICostCalculator
{
    public double EvaluateFormula(string formula, params VariableDefinition[] variables);
}