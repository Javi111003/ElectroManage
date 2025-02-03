namespace ElectroManage.Application.Abstractions;

/// <summary>
/// Provides an abstraction for file writing services within the application.
/// </summary>
public interface IFileWriterService
{
    /// <summary>
    /// Updates the allowed roles for a specific operation.
    /// </summary>
    /// <param name="roleName">The name of the role to update.</param>
    /// <param name="deleteRole">Indicates whether the role should be deleted. Default is false.</param>
    void UpdateAllowedRoles(string roleName, bool deleteRole = false);
}