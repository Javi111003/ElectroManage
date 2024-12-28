namespace ElectroManage.Application.Identity.Models;
public class AuthTokenOptions
{
    public string Audience { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public int AccessTokenExpiration { get; set; }
    public int RefreshTokenExpiration { get; set; }
    public string SecurityKey { get; set; } = string.Empty;
}