using ElectroManage.Application.Features.Auth.Login;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Models;

/// <summary>
/// Model representing the login credentials required for user authentication.
/// </summary>
public class LoginModel : ICommand<LoginUserResponse>
{
    /// <summary>
    /// Gets or sets the email address of the user.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Gets or sets the password of the user.
    /// </summary>
    public required string Password { get; set; }
}