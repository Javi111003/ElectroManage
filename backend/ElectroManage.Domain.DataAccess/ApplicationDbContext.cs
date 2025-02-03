using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ElectroManage.Common.Interfaces;
using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Domain.Enums;
using System.Reflection;

namespace ElectroManage.Domain.DataAccess
{
    /// <summary>
    /// Represents the main database context for the application, extending Identity functionality
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<AppUser, AppRole, long>
    {
        private readonly IDateTimeService _dateTime;
        private readonly ILoggerFactory _loggerFactory;

        /// <summary>
        /// Initializes a new instance of the ApplicationDbContext
        /// </summary>
        /// <param name="options">The options to be used by the DbContext</param>
        /// <param name="dateTime">Service for handling date and time operations</param>
        /// <param name="loggerFactory">Factory for creating loggers</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options,
            IDateTimeService dateTime,
            ILoggerFactory loggerFactory) : base(options)
        {
            _dateTime = dateTime;
            _loggerFactory = loggerFactory;
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }

        /// <summary>
        /// Protected constructor for testing purposes
        /// </summary>
        protected ApplicationDbContext()
        {
        }

        /// <summary>
        /// Asynchronously saves all changes made in this context to the database with automatic timestamp handling
        /// </summary>
        /// <param name="cancellationToken">A CancellationToken to observe while waiting for the task to complete</param>
        /// <returns>A task that represents the asynchronous save operation. The task result contains the number of state entries written to the database</returns>
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            foreach (var entry in ChangeTracker.Entries<IEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.Created = _dateTime.NowUtc;
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastModified = _dateTime.NowUtc;
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        /// <summary>
        /// Saves all changes made in this context to the database with automatic timestamp and status handling
        /// </summary>
        /// <returns>The number of state entries written to the database</returns>
        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries<IEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.Created = _dateTime.NowUtc;
                        entry.Entity.StatusBaseEntity = StatusEntityType.Active;
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastModified = _dateTime.NowUtc;
                        break;
                }
            }

            return base.SaveChanges();
        }

        /// <summary>
        /// Configures the database model and entity relationships
        /// </summary>
        /// <param name="builder">The model builder instance to be used for configuration</param>
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            builder.Ignore<IdentityUserToken<long>>();
            builder.Ignore<IdentityUserLogin<long>>();

            builder.Entity<AppUser>().ToTable("AppUsers");
            builder.Entity<AppRole>().ToTable("AppRoles");
            builder.Entity<IdentityUserRole<long>>().ToTable("AppUserRole");
            builder.Entity<IdentityUserClaim<long>>();
            builder.Entity<IdentityRoleClaim<long>>();
        }

        /// <summary>
        /// Configures additional database context options
        /// </summary>
        /// <param name="optionsBuilder">The builder being used to configure the context</param>
        /// <remarks>
        /// If the context is not already configured, it will attempt to configure using appsettings.json
        /// and set up logging
        /// </remarks>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (optionsBuilder.IsConfigured)
                return;

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            optionsBuilder.UseLoggerFactory(_loggerFactory);
        }
    }
}