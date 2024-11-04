using Microsoft.AspNetCore.Identity;
using Proyecto_IS.Domain.Enums;

namespace Proyecto_IS.Domain.Entites.Identity;
public class AppRole : IdentityRole<long>, IEntity
{
    public bool IsLock { get; set; } = false;
    public DateTime Created { get; set; }
    public DateTime? LastModified { get; set; }
    public StatusEntityType StatusBaseEntity { get; set; }
}