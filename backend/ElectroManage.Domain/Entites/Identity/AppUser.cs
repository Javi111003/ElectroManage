using Microsoft.AspNetCore.Identity;
using ElectroManage.Domain.Enums;

namespace ElectroManage.Domain.Entites.Identity;
public class AppUser : IdentityUser<long>, IEntity
{
    public DateTime Created { get; set; }
    public DateTime? LastModified { get; set; }
    public StatusEntityType StatusBaseEntity { get; set; }
}