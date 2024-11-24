using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class ConsumptionLimit : Entity<long>
{
    public decimal Limit { get; set; }
    public DateTime ApplyingDate { get; set; }
    public ICollection<Company> Companies { get; set; } = [];
}