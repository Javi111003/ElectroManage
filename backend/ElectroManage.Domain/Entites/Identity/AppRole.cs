using Microsoft.AspNetCore.Identity;
using ElectroManage.Domain.Enums;

namespace ElectroManage.Domain.Entites.Identity;
public class AppRole : IdentityRole<long>, IEntity
{
    public bool IsLock { get; set; } = false;
    public DateTime Created { get; set; }
    public DateTime? LastModified { get; set; }
    public StatusEntityType StatusBaseEntity { get; set; }
}