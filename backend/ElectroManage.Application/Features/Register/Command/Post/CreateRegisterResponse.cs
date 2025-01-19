namespace ElectroManage.Application.Features.Register.Command.Post;

public record CreateRegisterResponse
{
    public long Id { get; set; }
    public double Cost { get; set; }
    public double Consumption { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}