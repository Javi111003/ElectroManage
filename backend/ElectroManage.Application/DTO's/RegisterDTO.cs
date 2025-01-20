namespace ElectroManage.Application.DTO_s;

public record RegisterDTO
{
    public long Id { get; set; }
    public DateTime Date { get; set; }
    public double Cost { get; set; }
    public double Consumption { get; set; }
}
