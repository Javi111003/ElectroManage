namespace ElectroManage.Application.Identity.Models;

/// <summary>
/// Represents an access token used for authentication and authorization.
/// </summary>
public class AccessToken
{
    /// <summary>
    /// Gets or sets the token string.
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the expiration date and time of the token.
    /// </summary>
    public DateTime Expiration { get; set; }
}