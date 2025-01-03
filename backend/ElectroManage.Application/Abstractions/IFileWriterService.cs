namespace ElectroManage.Application.Abstractions;
public interface IFileWriterService
{
    void UpdateAllowedRoles(string roleName, bool deleteRole = false);
}