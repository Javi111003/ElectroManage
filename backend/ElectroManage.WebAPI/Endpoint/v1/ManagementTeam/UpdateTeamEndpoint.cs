using ElectroManage.Application.Features.ManagementTeam.Command.UpdateTeam;

namespace ElectroManage.WebAPI.Endpoint.v1.ManagementTeam;
public class UpdateTeamEndpoint : Endpoint<UpdateTeamCommand, UpdateTeamResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.ManagementTeam));
        Tags(RouteGroup.ManagementTeam);
        Version(1);
        AllowAnonymous();
        Put("/company/{companyId}/team/{teamId}");
        Summary(f => f.Summary = "Updating an existing team associated to a company");
    }
    public override async Task HandleAsync(UpdateTeamCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}
