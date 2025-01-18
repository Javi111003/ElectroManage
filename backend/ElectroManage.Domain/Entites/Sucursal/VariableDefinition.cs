using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class VariableDefinition : Entity<long>
{
    public string Name { get; set; } = string.Empty;
    public double? StaticValue { get; set; } 
    public string? Expression { get; set; } 
    public long FormulaId { get; set; }
    public CostFormula Formula { get; set; } = null!;
}