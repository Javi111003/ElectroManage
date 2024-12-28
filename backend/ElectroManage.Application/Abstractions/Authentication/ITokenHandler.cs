using ElectroManage.Application.Identity.Models;
using ElectroManage.Domain.Entites.Identity;
using System.Security.Claims;

namespace ElectroManage.Application.Abstractions.Authentication;
public interface ITokenHandler
{
    Task<AccessToken> CreateTokenAsync(AppUser appUser);
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token);
}