namespace ElectroManage.Application.Features.Administrative_Area.Query.Get;

public record AdministrativeAreaGetByIdCommand : ICommand<AdministrativeAreaGetByIdResponse>
{
    public required long Id { get; set; }
}
