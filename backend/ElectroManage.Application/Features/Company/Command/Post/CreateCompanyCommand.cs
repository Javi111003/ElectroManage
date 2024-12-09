namespace ElectroManage.Application.Features.Company.Command.Post;

public record CreateCompanyCommand : ICommand<CreateCompanyResponse>
{
    public string Name { get; set; } = string.Empty;
    public long AreaId { get; set; }
    public long InstallationTypeId { get; set; }
    public long LocationId { get; set; }
    public long ManagementTeamId { get; set; }
}