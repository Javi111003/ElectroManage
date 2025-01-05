using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.ListAll;

namespace ElectroManage.WebAPI.Endpoint.v1.Company
{
    public class ListCompanyEndpoint : Endpoint<EmptyRequest, IEnumerable<CompanyResponse>>
    {
        public override void Configure()
        {
            Options(x => x.WithTags(RouteGroup.Company));
            Tags(RouteGroup.Company);
            Version(1);
            Get("/company");
            AllowAnonymous();
            Summary(f => f.Summary = "Listing all companies's general data");
        }
        public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
        {
            var query = new ListCompanyQuery();
            var data = await query.ExecuteAsync(ct);
            await SendAsync(data, cancellation: ct);
        }
    }
}
