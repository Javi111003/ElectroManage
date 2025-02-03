using ElectroManage.Common.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ElectroManage.WebAPI.Models;

/// <summary>
/// Model representing the registration details required for creating a new user account.
/// </summary>
public class RegisterModel : ICommand<Response<NoContentData>>
{
    /// <summary>
    /// Gets or sets the email address of the user.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Gets or sets the username of the user. This field is optional.
    /// </summary>
    public string? Username { get; set; }

    /// <summary>
    /// Gets or sets the password of the user.
    /// </summary>
    public required string Password { get; set; }

    /// <summary>
    /// Gets or sets the roles assigned to the user.
    /// </summary>
    public IEnumerable<string> Roles { get; set; } = new HashSet<string>();

    /// <summary>
    /// Gets or sets the company ID associated with the user.
    /// </summary>
    public long CompanyId { get; set; }
}