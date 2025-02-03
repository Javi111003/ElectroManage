using ElectroManage.Application.Abstractions;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;

namespace ElectroManage.Application.Services;

/// <summary>
/// Service for writing and updating configuration files, specifically for managing allowed roles.
/// </summary>
public class FileWriterService : IFileWriterService
{
    private readonly IConfiguration _configuration;

    /// <summary>
    /// Initializes a new instance of the <see cref="FileWriterService"/> class with the specified configuration.
    /// </summary>
    /// <param name="configuration">The configuration to be used by the service.</param>
    public FileWriterService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Updates the allowed roles in the appsettings.json file by adding or removing a specified role.
    /// </summary>
    /// <param name="roleName">The name of the role to add or remove.</param>
    /// <param name="deleteRole">If set to <c>true</c>, the role will be removed; otherwise, it will be added.</param>
    /// <exception cref="Exception">Thrown when an error occurs during the update process.</exception>
    public void UpdateAllowedRoles(string roleName, bool deleteRole = false)
    {
        try
        {
            // Get the path to the appsettings.json file
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");

            // Read the JSON content from the file
            var json = File.ReadAllText(filePath);

            // Parse the JSON content into a JObject
            var jsonObj = JObject.Parse(json);

            // Retrieve the AllowedRoles section from the JSON
            var allowedRolesSection = jsonObj["AllowedRoles"]?.ToString() ?? "";

            if (!deleteRole)
            {
                // Add the new role to the allowed roles
                allowedRolesSection += $",{roleName}";

                // Remove leading comma if the section was initially empty
                if (allowedRolesSection.Length - 1 == roleName.Length)
                {
                    allowedRolesSection = allowedRolesSection.Substring(1, allowedRolesSection.Length);
                }
            }
            else
            {
                // Remove the role from the allowed roles
                allowedRolesSection = allowedRolesSection.Replace($",{roleName}", "");
            }

            // Update the AllowedRoles section in the JSON object
            jsonObj["AllowedRoles"] = allowedRolesSection;

            // Write the updated JSON back to the file
            File.WriteAllText(filePath, jsonObj.ToString());
        }
        catch (Exception ex)
        {
            // Throw an exception if an error occurs during the update
            throw new Exception($"Error updating allowed roles: {ex.Message}");
        }
    }
}