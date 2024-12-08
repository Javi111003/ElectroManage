using ElectroManage.Application.Features.Company.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class CreateCompanyEndpoint : Endpoint<CreateCompanyCommand, CreateCompanyResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Post("/company");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new Company");
    }

    public override async Task HandleAsync(CreateCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
