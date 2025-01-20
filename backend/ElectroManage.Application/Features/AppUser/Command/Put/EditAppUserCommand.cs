namespace ElectroManage.Application.Features.AppUser.Command.Put;

public record EditAppUserCommand : ICommand<EditAppUserResponse>
{
    public long Id { get; set; }
    public string Username { get; set; } = null!;
    public IEnumerable<string> Roles {  get; set; } = new HashSet<string>();
    public long CompanyId { get; set; }
}