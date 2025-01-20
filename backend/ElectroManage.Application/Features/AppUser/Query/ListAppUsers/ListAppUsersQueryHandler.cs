using Microsoft.Extensions.Logging;
using ElectroManage.Domain.DataAccess.Abstractions;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using User = ElectroManage.Domain.Entites.Identity.AppUser;
using Microsoft.AspNetCore.Identity;

namespace ElectroManage.Application.Features.AppUser.Query.ListAppUsers;
public class ListAppUsersQueryHandler : CoreQueryHandler<ListAppUsersQuery, ListAppUsersResponse>
{
    readonly ILogger<ListAppUsersQueryHandler> _logger;
    readonly UserManager<User> _userManager;
    public ListAppUsersQueryHandler(ILogger<ListAppUsersQueryHandler> logger, IUnitOfWork unitOfWork, UserManager<User> userManager) : base(unitOfWork)
    {
        _logger = logger;
        _userManager = userManager;
    }
    public override async Task<ListAppUsersResponse> ExecuteAsync(ListAppUsersQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepository = UnitOfWork!.DbRepository<User>();
        var include = new List<Expression<Func<User, object>>>
        {
            x => x.Company
        };
        var users = await userRepository.GetAll(useInactive: true,includes: include).ToListAsync();
        var rolesForUsers = new List<IList<string>>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            rolesForUsers.Add(roles ?? []);
        }
        var response = Mappers.AppUserMapper.MapToListUsersResponse(users, rolesForUsers);
        return new ListAppUsersResponse { AppUsers = response };
    }
}