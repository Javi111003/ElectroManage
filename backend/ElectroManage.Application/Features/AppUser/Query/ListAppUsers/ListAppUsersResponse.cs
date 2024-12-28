namespace ElectroManage.Application.Features.AppUser.Query.ListAppUsers;
public record ListAppUsersResponse
{
    public IEnumerable<string?> Emails { get; set; } = new HashSet<string?>();
    public string Message { get; set; } = string.Empty;
}