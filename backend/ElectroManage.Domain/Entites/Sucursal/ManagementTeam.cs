using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Sucursal;
public class ManagementTeam : Entity<long>
{
    public string? Name { get; set; } 
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public ICollection<AppUser> Members { get; set; } = [];
}