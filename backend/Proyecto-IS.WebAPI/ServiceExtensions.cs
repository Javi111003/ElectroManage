using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Proyecto_IS.Application;
using Proyecto_IS.Common.Interfaces;
using Proyecto_IS.Domain.DataAccess;
using Proyecto_IS.Domain.Entites.Identity;
using Proyecto_IS.Domain.Settings;
using Proyecto_IS.Infraestructure.Email;
using Proyecto_IS.Infraestructure.Services;
using System.Security.Claims;
using System.Text;

namespace Proyecto_IS.WebAPI;
public static class ServiceExtensions
{
    public static void AddCustomServicesExtension(this IServiceCollection services)
    {
        services.AddScoped<IUserValidator<AppUser>, CustomUserValidator<AppUser>>();
        services.AddScoped<IDateTimeService, DateTimeService>();
        services.AddSingleton<IEmailSender<AppUser>, IdentityEmailSender>();
    }

    public static void AddJWTAuthenticationExtension(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["TokenOptions:Issuer"],
                    ValidAudience = configuration["TokenOptions:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenOptions:SecurityKey"]))
                };
            });
    }
    public static void AddIdentityExtension(this IServiceCollection services) 
    {   
        services.AddIdentity<AppUser, AppRole>(options =>
            {
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;
                options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
            })
               .AddEntityFrameworkStores<ApplicationDbContext>()
               .AddDefaultTokenProviders();
    }
    public static void AddDbContextExtension(this IServiceCollection services, IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("UseInMemoryDatabase"))
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("ApplicationDb"));
        }
        else
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    builder => { builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName); }));
        }
    }
    public static IServiceProvider ApplyMigrationsExtension(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var pendingMigration = db.Database.GetPendingMigrations();
        if (pendingMigration.Any())
        {
            db.Database.Migrate();
        }
        
        return serviceProvider;
    }
    public static  IServiceCollection SetSettingsExtension(this IServiceCollection services,
    IConfiguration configuration)
    {
        services.Configure<HangFireSettings>(configuration.GetSection("HangFire"));
        return services;
    }
    public static void AddCorsExtension(this IServiceCollection services)
    {
        services.AddCors(cors =>
        {
            cors.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin();
            });
        });
    }
}