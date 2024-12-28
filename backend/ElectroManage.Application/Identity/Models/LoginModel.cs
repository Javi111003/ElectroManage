using ElectroManage.Application.Features.Auth.Login;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Models;

public class LoginModel : ICommand<LoginUserResponse>
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}