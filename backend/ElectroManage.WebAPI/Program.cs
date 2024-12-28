using FastEndpoints.Swagger;
using Hangfire;
using Hangfire.PostgreSql;
using HangfireBasicAuthenticationFilter;
using Microsoft.Extensions.Options;
using ElectroManage.Domain.Settings;
using ElectroManage.WebAPI;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFastEndpoints(o =>
{
    o.SourceGeneratorDiscoveredTypes.AddRange(ElectroManage.WebAPI.DiscoveredTypes.All);
    o.SourceGeneratorDiscoveredTypes.AddRange(ElectroManage.Application.DiscoveredTypes.All);
});
builder.Services.AddSwaggerGen();
builder.Services.AddCustomServicesExtension();
builder.Services.AddDbContextExtension(builder.Configuration);
builder.Services.AddCorsExtension();
builder.Services.AddAuthorization();

builder.Services.SwaggerDocument(o =>
{
    o.MinEndpointVersion = 1;
    o.MaxEndpointVersion = 1;
    o.AutoTagPathSegmentIndex = 0;
});

builder.Services.AddIdentityExtension();
builder.Services.AddGenericRepositoryExtension();
builder.Services.AddJWTAuthenticationExtension(builder.Configuration);
builder.Services.AddAuthorizationPoliciesExtension(builder.Configuration);
builder.Services.SetSettingsExtension(builder.Configuration);
builder.Services.AddHangfire(config => config.UsePostgreSqlStorage((c) =>
{
    c.UseNpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
}));
builder.Services.AddHangfireServer();

var app = builder.Build();
app.UseCors();
var hangFire = app.Services.GetService<IOptions<HangFireSettings>>()!.Value;

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] {
            new HangfireCustomBasicAuthenticationFilter { User = hangFire.Username, Pass = hangFire.Password }
        }
})
    .UseRouting()
    .UseAuthentication()
    .UseAuthorization()
    .UseFastEndpoints(c =>
    {
        c.Errors.UseProblemDetails();
        c.Versioning.Prefix = "v";
        c.Versioning.PrependToRoute = true;
        c.Versioning.DefaultVersion = 1;
    })
    .UseSwaggerGen()
    .ApplicationServices.ApplyMigrationsExtension();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.Run();