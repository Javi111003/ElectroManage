using ElectroManage.Application.Abstractions.Authentication;
using ElectroManage.Application.Identity.Models;
using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Infraestructure.Crypto;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ElectroManage.Application.Services.Authentication;

[RegisterService<ITokenHandler>(LifeTime.Scoped)]
public class JwtHandler : ITokenHandler
{
    public IConfiguration Configuration { get; }
    private readonly AuthTokenOptions _tokenOptions;
    private DateTime _accessTokenExpiration;
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<AppRole> _roleManager;

    public JwtHandler(IConfiguration configuration, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        Configuration = configuration;
        _tokenOptions = Configuration.GetSection("TokenOptions").Get<AuthTokenOptions>()!;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<AccessToken> CreateTokenAsync(AppUser appUser)
    {
        _accessTokenExpiration = DateTime.Now.AddMinutes(_tokenOptions.AccessTokenExpiration);
        SecurityKey securityKey = SecurityEncrypt.CreateSecurityKey(_tokenOptions.SecurityKey);
        SigningCredentials signingCredentials = SigningCredentialsHelper.CreateSigningCredentials(securityKey);
        _accessTokenExpiration = DateTime.Now.AddMinutes(_tokenOptions.AccessTokenExpiration);
        var roles = await _userManager.GetRolesAsync(appUser);
        JwtSecurityToken jwt = await CreateJwtSecurityToken(_tokenOptions, appUser, signingCredentials, roles);
        JwtSecurityTokenHandler jwtSecurityTokenHandler = new();
        string? token = jwtSecurityTokenHandler.WriteToken(jwt);

        return new AccessToken
        {
            Token = token,
            Expiration = _accessTokenExpiration
        };
    }

    public Task<JwtSecurityToken> CreateJwtSecurityToken(AuthTokenOptions tokenOptions, AppUser user,
                                                   SigningCredentials signingCredentials, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        JwtSecurityToken jwt = new(
            tokenOptions.Issuer,
            tokenOptions.Audience,
            claims,
            expires: _accessTokenExpiration,
            notBefore: DateTime.Now,
            signingCredentials: signingCredentials
        );
        return Task.FromResult(jwt);
    }
    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenOptions.SecurityKey)),
            ValidateLifetime = true
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
        if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;

    }
}