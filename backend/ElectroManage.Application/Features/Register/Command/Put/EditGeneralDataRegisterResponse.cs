using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Register.Command.Put;

public record EditGeneralDataRegisterResponse
{
    public long Id { get; set; }
    public double Cost { get; set; }
    public double Consumption { get; set; }
    public DateTime Date { get; set; }
    public bool IsOverLimit { get; set; } = false;
    public WarningDTO? WarningInfo { get; set; }
}