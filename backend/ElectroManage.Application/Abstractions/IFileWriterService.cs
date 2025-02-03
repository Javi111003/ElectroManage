namespace ElectroManage.Application.Abstractions;
/// <summary>
/// Interface for file writer service.
/// </summary>
public interface IFileWriterService
{
    /// <summary>
    /// Updates the allowed roles.
    /// </summary>
    /// <param name="roleName">Name of the role to update.</param>
    /// <param name="deleteRole">If set to <c>true</c>, the role will be deleted; otherwise, it will be added or updated.</param>
    void UpdateAllowedRoles(string roleName, bool deleteRole = false);
}