using Microsoft.AspNetCore.Identity;
using ElectroManage.Domain.Enums;
using ElectroManage.Domain.Entites.Sucursal;

namespace ElectroManage.Domain.Entites.Identity;
public class AppUser : IdentityUser<long>, IEntity
{
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public long? ManagementTeamId { get; set; }
    public ManagementTeam? ManagementTeam { get; set; }
    public DateTime Created { get; set; }
    public DateTime? LastModified { get; set; }
    public StatusEntityType StatusBaseEntity { get; set; }
}