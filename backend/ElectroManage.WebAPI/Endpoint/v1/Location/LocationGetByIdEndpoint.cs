using ElectroManage.Application.Features.Location.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Location;

public class LocationGetByIdEndpoint : Endpoint<LocationGetByIdCommand, LocationGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Location));
        Tags(RouteGroup.Location);
        Version(1);
        Get("/location/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Getting general data of a Location");
    }

    public override async Task HandleAsync(LocationGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync();
        await SendAsync(data);
    }
}
