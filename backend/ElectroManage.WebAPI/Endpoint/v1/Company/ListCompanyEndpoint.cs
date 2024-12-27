using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Company
{
    public class ListCompanyEndpoint : Endpoint<EmptyRequest, List<CompanyDTO>>
    {
        public override void Configure()
        {
            Options(x => x.WithTags(RouteGroup.Company));
            Tags(RouteGroup.Company);
            Version(1);
            Get("/company");
            AllowAnonymous();
            Summary(f => f.Summary = "Listing all companies");
        }
        public override Task HandleAsync(EmptyRequest req, CancellationToken ct)
        {
            var faker = new CompanyBogusConfig();
            var data = faker.Generate(15);
            return SendAsync(data, cancellation: ct);
        }
    }
}
