using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.ListCompanyOverLimit;

namespace ElectroManage.WebAPI.Endpoint.v1.Company
{
    public class ListCompanyOverLimitEndpoint : Endpoint<ListCompanyOverLimitQuery, IEnumerable<CompanyOverLimitResponse>>
    {
        public override void Configure()
        {
            Options(x => x.WithTags(RouteGroup.Company));
            Tags(RouteGroup.Company);
            Version(1);
            Get("/company/limit");
            AllowAnonymous();
            Summary(f => f.Summary = "Listing all companies that exceeded their consumption limit at a given date");
        }
        public override async Task HandleAsync(ListCompanyOverLimitQuery req, CancellationToken ct)
        {
            var data = await req.ExecuteAsync(ct);
            await SendAsync(data, cancellation: ct);
        }
    }
}
