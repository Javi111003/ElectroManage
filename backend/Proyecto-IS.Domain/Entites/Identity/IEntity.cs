using Proyecto_IS.Domain.Enums;

namespace Proyecto_IS.Domain.Entites.Identity;

public interface IEntity
{
    public DateTime Created { get; set; }
    public DateTime? LastModified { get; set; }
    public StatusEntityType StatusBaseEntity { get; set; }
}