using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.Company.Command.Delete;

public record DeleteCompanyCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
