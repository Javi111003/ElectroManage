using ElectroManage.Application.Identity.Models;
using ElectroManage.Domain.Entites.Identity;
using System.Security.Claims;

namespace ElectroManage.Application.Abstractions.Authentication;
/// <summary>
/// Interface for handling token-related operations.
/// </summary>
public interface ITokenHandler
{
    /// <summary>
    /// Creates an access token for the specified user.
    /// </summary>
    /// <param name="appUser">The application user for whom the token is being created.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the access token.</returns>
    Task<AccessToken> CreateTokenAsync(AppUser appUser);

    /// <summary>
    /// Retrieves the principal from an expired token.
    /// </summary>
    /// <param name="token">The expired token.</param>
    /// <returns>The claims principal extracted from the expired token, or null if the token is invalid.</returns>
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token);
}