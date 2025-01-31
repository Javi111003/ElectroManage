﻿using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Location.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.Location;
public class EditGeneralDataLocationEndpoint : Endpoint<EditGeneralDataLocationCommand, LocationDTO>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Location));
        Tags(RouteGroup.Location);
        Version(1);
        Put("/location/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit location general data");
    }
    public override async Task HandleAsync(EditGeneralDataLocationCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}