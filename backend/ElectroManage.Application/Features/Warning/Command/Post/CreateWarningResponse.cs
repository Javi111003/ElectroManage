namespace ElectroManage.Application.Features.Warning.Command.Post;

public record CreateWarningResponse
{
    public long Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public decimal EstablishedLimit { get; set; }
    public decimal Consumption { get; set; }
}
