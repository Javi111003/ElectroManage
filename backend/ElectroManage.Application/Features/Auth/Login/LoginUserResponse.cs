using ElectroManage.Application.Identity.Models;

namespace ElectroManage.Application.Features.Auth.Login;
public record LoginUserResponse
{
    public AccessToken AccessToken { get; set; } = null!;
}