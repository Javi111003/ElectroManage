using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.AppUser.Query.ListAppUsers;
public record ListAppUsersResponse
{
   public IEnumerable<AppUserDto> AppUsers { get; set; } = new HashSet<AppUserDto>();
}