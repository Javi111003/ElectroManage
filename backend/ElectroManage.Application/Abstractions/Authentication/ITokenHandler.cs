using ElectroManage.Application.Identity.Models;
using ElectroManage.Domain.Entites.Identity;
using System.Security.Claims;

namespace ElectroManage.Application.Abstractions.Authentication;

/// <summary>
/// Provides an abstraction for handling token operations such as creation and validation.
/// </summary>
public interface ITokenHandler
{
    /// <summary>
    /// Asynchronously creates an access token for a specified application user.
    /// </summary>
    /// <param name="appUser">The application user for whom the token is created.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the created access token.</returns>
    Task<AccessToken> CreateTokenAsync(AppUser appUser);

    /// <summary>
    /// Retrieves the claims principal from an expired token.
    /// </summary>
    /// <param name="token">The expired token from which to retrieve the claims principal.</param>
    /// <returns>The claims principal extracted from the expired token, or null if the token is invalid.</returns>
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token);
}