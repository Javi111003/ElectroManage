using Microsoft.Extensions.Logging;
using ElectroManage.Domain.DataAccess.Abstractions;

namespace ElectroManage.Application.Features.AppUser.Query.ListAppUsers;
public class ListAppUsersQueryHandler : CoreQueryHandler<ListAppUsersQuery, ListAppUsersResponse>
{
    public ListAppUsersQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }
    public override Task<ListAppUsersResponse> ExecuteAsync(ListAppUsersQuery command, CancellationToken ct = default)
    {
        //_logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepository = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();
        var users = userRepository.GetAll(useInactive: true).Select(u => u.UserName).ToList();
        return Task.FromResult(new ListAppUsersResponse
        {
            Emails = users,
            Message = "Al berro "
        });
    }
}