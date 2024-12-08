namespace ElectroManage.Application.Features.Register.Query.Get;

public record RegisterGetByIdResponse
{
    public decimal Cost { get; set; }
    public decimal Consumption { get; set; }
    public DateTime Date { get; set; }
}
