﻿using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.ListAll;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ListCompanyEndpoint : Endpoint<EmptyRequest, ListAllCompaniesResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/select");
        AllowAnonymous();
        Summary(f => f.Summary = "Listing all companies");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var list = new ListAllCompaniesCommand();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
