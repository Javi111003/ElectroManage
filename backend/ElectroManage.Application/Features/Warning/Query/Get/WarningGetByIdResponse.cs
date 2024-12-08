namespace ElectroManage.Application.Features.Warning.Query.Get;

public record WarningGetByIdResponse
{
    public string CompanyName { get; set; } = string.Empty;
    public decimal EstablishedLimit { get; set; }
    public decimal Consumption { get; set; }
}
