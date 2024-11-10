using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using ElectroManage.Application;
using ElectroManage.Common.Interfaces;
using ElectroManage.Domain.DataAccess;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.DataAccess.Concrete;
using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Domain.Settings;
using ElectroManage.Infraestructure.Email;
using ElectroManage.Infraestructure.Services;
using System.Security.Claims;
using System.Text;

namespace ElectroManage.WebAPI;
public static class ServiceExtensions
{
    public static void AddCustomServicesExtension(this IServiceCollection services)
    {
        services.AddScoped<IUserValidator<AppUser>, CustomUserValidator<AppUser>>();
        services.AddScoped<IDateTimeService, DateTimeService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddSingleton<IEmailSender<AppUser>, IdentityEmailSender>();
    }
    public static void AddGenericRepositoryExtension(this IServiceCollection services)
    {
        services.TryAddScoped(typeof(Domain.DataAccess.Abstractions.IGenericCoreRepository<>), typeof(GenericCoreRepository<>));
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
                options.SignIn.RequireConfirmedEmail = false;
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
    public static void AddAuthorizationPoliciesExtension(this IServiceCollection services, IConfiguration configuration)
    {
        //Añadir policies para las constantes de autorización que se creen 
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