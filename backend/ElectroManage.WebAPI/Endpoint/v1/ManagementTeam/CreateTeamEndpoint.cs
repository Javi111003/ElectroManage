using ElectroManage.Application.Features.ManagementTeam.Command.CreateTeam;

namespace ElectroManage.WebAPI.Endpoint.v1.ManagementTeam;
public class CreateTeamEndpoint : Endpoint<CreateTeamCommand, CreateTeamResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.ManagementTeam));
        Tags(RouteGroup.ManagementTeam);
        Version(1);
        AllowAnonymous();
        Post("/company/{companyId}/team");
        Summary(f => f.Summary = "Creating a new team associated to a company");
    }
    public override async Task HandleAsync(CreateTeamCommand req, CancellationToken ct)
    {
        var data =  await req.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}