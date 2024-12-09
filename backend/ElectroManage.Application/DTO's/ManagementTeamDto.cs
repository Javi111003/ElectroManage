namespace ElectroManage.Application.DTO_s;
public record ManagementTeamDto
{
    public long Id { get; set; }
    public string? TeamName { get; set; } = string.Empty;
    public long CompanyId { get; set; }
    public IEnumerable<UserTeamDto> Members { get; set; } = new HashSet<UserTeamDto>();
}