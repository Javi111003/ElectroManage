namespace ElectroManage.Application.Features.AppUser.Query.GetById;
public record GetUserByIdQuery : ICommand<GetUserByIdResponse>
{
    public long Id { get; set; }
}