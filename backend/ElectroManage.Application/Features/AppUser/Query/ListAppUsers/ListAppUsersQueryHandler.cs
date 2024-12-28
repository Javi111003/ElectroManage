using Microsoft.Extensions.Logging;
using ElectroManage.Domain.DataAccess.Abstractions;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace ElectroManage.Application.Features.AppUser.Query.ListAppUsers;
public class ListAppUsersQueryHandler : CoreQueryHandler<ListAppUsersQuery, ListAppUsersResponse>
{
    ILogger<ListAppUsersQueryHandler> _logger;
    public ListAppUsersQueryHandler(ILogger<ListAppUsersQueryHandler> logger, IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
    }
    public override async Task<ListAppUsersResponse> ExecuteAsync(ListAppUsersQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepository = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();
        var include = new List<Expression<Func<Domain.Entites.Identity.AppUser, object>>>
        {
            x => x.Company
        };
        var users = await userRepository.GetAll(useInactive: true,includes: include).ToListAsync();
        var response = Mappers.AppUserMapper.MapToListUsersResponse(users);
        return new ListAppUsersResponse { AppUsers = response };
    }
}