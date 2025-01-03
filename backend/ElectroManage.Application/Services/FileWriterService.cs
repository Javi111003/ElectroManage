using ElectroManage.Application.Abstractions;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;

namespace ElectroManage.Application.Services;
public class FileWriterService : IFileWriterService
{
    private readonly IConfiguration _configuration;
    public FileWriterService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public void UpdateAllowedRoles(string roleName, bool deleteRole = false)
    {
        try
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = File.ReadAllText(filePath);
            var jsonObj = JObject.Parse(json);
            var allowedRolesSection = jsonObj["AllowedRoles"]?.ToString() ?? "";
            if (!deleteRole)
            {
                allowedRolesSection += $",{roleName}";
                if(allowedRolesSection.Length - 1 == roleName.Length)
                {
                    allowedRolesSection = allowedRolesSection.Substring(1, allowedRolesSection.Length);
                }
            }
            else
            {
                allowedRolesSection = allowedRolesSection.Replace($",{roleName}", "");
            }

            jsonObj["AllowedRoles"] = allowedRolesSection;
            File.WriteAllText(filePath, jsonObj.ToString());
        }
        catch (Exception ex)
        {
            throw new Exception($"Error updating allowed roles: {ex.Message}");
        }
    }
}