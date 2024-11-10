using ElectroManage.Domain.Enums;

namespace ElectroManage.Domain.Entites.Identity;
public class Entity<T> : Entity where T : struct
{
    public T Id { get; set; }

}

public class Entity : IEntity
{
    public DateTime Created { get; set; }

    public DateTime? LastModified { get; set; }
    public StatusEntityType StatusBaseEntity { get; set; } = StatusEntityType.Active;
}