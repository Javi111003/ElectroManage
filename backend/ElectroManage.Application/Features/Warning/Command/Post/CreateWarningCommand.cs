namespace ElectroManage.Application.Features.Warning.Command.Post;

public record CreateWarningCommand : ICommand<CreateWarningResponse>
{
    public long CompanyId { get; set; }
    public decimal EstablishedLimit { get; set; }
    public decimal Consumption {  get; set; }
}
