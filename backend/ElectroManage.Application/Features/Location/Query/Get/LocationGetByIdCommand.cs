namespace ElectroManage.Application.Features.Location.Query.Get;

public record LocationGetByIdCommand : ICommand<LocationGetByIdResponse>
{
    public long Id { get; set; }
}
