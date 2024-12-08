namespace ElectroManage.Application.Features.Register.Command.Post;

public record CreateRegisterCommand : ICommand<CreateRegisterResponse>
{
    public long CompanyId { get; set; }
    public decimal Cost { get; set; }
    public decimal Consumption { get; set; }
    public DateTime Date { get; set; }
}
