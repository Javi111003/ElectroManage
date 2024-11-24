using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class CostFormula : Entity<long>
{
    public decimal ExtraPerCent { get; set; }
    public long Increase { get; set; }
    public DateTime ApplyingDate { get; set; }
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
}