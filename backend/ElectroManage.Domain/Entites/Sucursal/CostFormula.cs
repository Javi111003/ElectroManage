using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class CostFormula : Entity<long>
{
    public string? Name { get; set; }
    public string Expression { get; set; } = string.Empty;
    public DateTime ApplyingDate { get; set; }
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public ICollection<VariableDefinition> VariableDefinitions { get; set; } = [];
}