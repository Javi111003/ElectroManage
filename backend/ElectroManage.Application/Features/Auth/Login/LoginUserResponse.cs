using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Identity.Models;

namespace ElectroManage.Application.Features.Auth.Login;
public record LoginUserResponse
{
    public long Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public CompanyDTO Company { get; set; } = null!;
    public IEnumerable<string> Roles { get; set; } = new HashSet<string>();
    public AccessToken AccessToken { get; set; } = null!;
}