using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.AppUser.Query.GetById;
public record GetUserByIdResponse
{
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public CompanyDTO Company { get; set; } = null!;
    public IEnumerable<string> Roles { get; set; } = new HashSet<string>();
}