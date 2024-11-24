using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class Warning : Entity<long>
{
    public decimal EstablishedLimit { get; set; }
    public decimal Consumption { get; set; }
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
}