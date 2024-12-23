using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class ConsumptionLimit : Entity<long>
{
    public decimal Limit { get; set; }
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public DateTime ApplyingDate { get; set; }
}