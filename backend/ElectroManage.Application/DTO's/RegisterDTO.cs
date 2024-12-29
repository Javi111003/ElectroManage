namespace ElectroManage.Application.DTO_s;

public record RegisterDTO
{
    public DateTime Date { get; set; }
    public decimal Cost { get; set; }
    public decimal Consumption { get; set; }
}
