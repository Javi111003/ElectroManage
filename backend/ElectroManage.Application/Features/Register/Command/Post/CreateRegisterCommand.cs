namespace ElectroManage.Application.Features.Register.Command.Post;

public record CreateRegisterCommand : ICommand<CreateRegisterResponse>
{
    public long CompanyId { get; set; }
    public double Consumption { get; set; }
    public DateTime Date { get; set; }
}