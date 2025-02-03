namespace ElectroManage.Application.Identity.Models;

/// <summary>
/// Configuration options for generating authentication tokens.
/// </summary>
public class AuthTokenOptions
{
    /// <summary>
    /// Gets or sets the audience for the token, indicating the recipients that the token is intended for.
    /// </summary>
    public string Audience { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the issuer of the token, indicating the entity that issued the token.
    /// </summary>
    public string Issuer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the expiration time in minutes for the access token.
    /// </summary>
    public int AccessTokenExpiration { get; set; }

    /// <summary>
    /// Gets or sets the expiration time in minutes for the refresh token.
    /// </summary>
    public int RefreshTokenExpiration { get; set; }

    /// <summary>
    /// Gets or sets the security key used for signing the token.
    /// </summary>
    public string SecurityKey { get; set; } = string.Empty;
}