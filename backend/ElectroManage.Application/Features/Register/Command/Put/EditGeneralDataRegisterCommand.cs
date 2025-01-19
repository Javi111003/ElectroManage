namespace ElectroManage.Application.Features.Register.Command.Put;

public record EditGeneralDataRegisterCommand : ICommand<EditGeneralDataRegisterResponse>
{
    public long Id { get; set; }
    public double Consumption { get; set; }
    public DateTime Date { get; set; }
}
