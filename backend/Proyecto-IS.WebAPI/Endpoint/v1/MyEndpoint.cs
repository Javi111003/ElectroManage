public class MyEndpoint : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get("/my-endpoint");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        await SendAsync("Hello, world!", cancellation: ct);
    }
}