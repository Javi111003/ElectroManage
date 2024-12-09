namespace ElectroManage.Application.DTO_s;
public record UserTeamDto 
{
    public long UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
}