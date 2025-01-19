namespace ElectroManage.Application.Features.Register.Query.Get;

public record RegisterGetByIdResponse
{
    public double Cost { get; set; }
    public double Consumption { get; set; }
    public DateTime Date { get; set; }
}
