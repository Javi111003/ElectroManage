namespace ElectroManage.Application.Features.Administrative_Area.Query.Get;

public class AdministrativeAreaGetByIdResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Created { get; set; }
    public string Status { get; set; } = string.Empty;
}
