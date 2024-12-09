using ElectroManage.Application.Features.ManagementTeam.Command.DeleteTeam;

namespace ElectroManage.WebAPI.Endpoint.v1.ManagementTeam;
public class DeleteTeamEndpoint : Endpoint<DeleteTeamCommand, DeleteTeamResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.ManagementTeam));
        Tags(RouteGroup.ManagementTeam);
        Version(1);
        AllowAnonymous();
        Delete("/company/{companyId}/team/{teamId}");
        Summary(f => f.Summary = "Deleting an existing team associated to a company");
    }
    public override async Task HandleAsync(DeleteTeamCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}