using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using User = ElectroManage.Domain.Entites.Identity.AppUser;

namespace ElectroManage.Application.Features.AppUser.Query.GetById;
public class GetUserByIdQueryHandler : CoreQueryHandler<GetUserByIdQuery, GetUserByIdResponse>
{
    readonly ILogger<GetUserByIdQueryHandler> _logger;
    readonly UserManager<User> _userManager;
    public GetUserByIdQueryHandler(ILogger<GetUserByIdQueryHandler> logger, IUnitOfWork unitOfWork, UserManager<User> userManager) : base(unitOfWork)
    {
        _logger = logger;
        _userManager = userManager;
    }
    public override async Task<GetUserByIdResponse> ExecuteAsync(GetUserByIdQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepository = UnitOfWork!.DbRepository<User>();
        var include = new List<Expression<Func<User, object>>>
        {
            x => x.Company
        };
        var user = await userRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id, includes: include);
        if (user == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id {command.Id} not found");
            ThrowError($" User with id {command.Id} not found", 404);
        }
        var roles = await _userManager.GetRolesAsync(user);
        var response = Mappers.AppUserMapper.MapToGetByIdResponse(user, roles);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return response;
    }
}