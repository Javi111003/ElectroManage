using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.AppUser.Command.Put;
public record EditAppUserResponse
{
    public long Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public IEnumerable<string> Roles { get; set; } = new HashSet<string>();
    public CompanyDTO Company { get; set; } = null!;
}