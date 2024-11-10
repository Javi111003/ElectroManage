namespace ElectroManage.Application.Features.AppUser.Query;
public record ListAppUsersResponse
{
    public IEnumerable<string?> Emails { get; set; } = new HashSet<string?>();
    public string Message { get; set; } = string.Empty;
}