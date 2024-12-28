using ElectroManage.Application.Features.Location.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Location;

public class LocationGetByIdEndpoint : Endpoint<EmptyRequest, LocationGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Location));
        Tags(RouteGroup.Location);
        Version(1);
        Get("/location/{locationId}");
        AllowAnonymous();
        Summary(f => f.Summary = "Getting general data of a Location");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var query = new LocationGetByIdCommand { Id = Route<long>("locationId") };
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}