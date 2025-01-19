namespace ElectroManage.Application.Features.AppUser.Command.Put;

public record EditAppUserCommand : ICommand<EditAppUserResponse>
{
    public long Id { get; set; }
    public string Username { get; set; } = null!;
    public string Role {  get; set; } = null!;
    public long CompanyId { get; set; }
}
