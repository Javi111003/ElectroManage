namespace ElectroManage.Application.Features.Register.Query.Get;

public record RegisterGetByIdCommand : ICommand<RegisterGetByIdResponse>
{
    public long Id { get; set; }
}
