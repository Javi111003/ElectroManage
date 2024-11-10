using ElectroManage.Domain.Enums;

namespace ElectroManage.Domain.Entites.Identity;

public interface IEntity
{
    public DateTime Created { get; set; }
    public DateTime? LastModified { get; set; }
    public StatusEntityType StatusBaseEntity { get; set; }
}