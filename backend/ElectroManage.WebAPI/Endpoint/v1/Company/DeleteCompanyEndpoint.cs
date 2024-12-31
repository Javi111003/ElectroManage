using ElectroManage.Application.Features.Company.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class DeleteCompanyEndpoint : Endpoint<DeleteCompanyCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Delete("/company/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete a company");
    }

    public override async Task HandleAsync(DeleteCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
