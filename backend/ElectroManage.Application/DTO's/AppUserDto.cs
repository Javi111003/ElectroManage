namespace ElectroManage.Application.DTO_s;
public record AppUserDto
{
    public long Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public CompanyDTO Company { get; set; } = null!;
    public IEnumerable<string> Roles { get; set; } = new HashSet<string>();
}