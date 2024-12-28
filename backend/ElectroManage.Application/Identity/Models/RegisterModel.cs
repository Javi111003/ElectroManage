using ElectroManage.Common.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ElectroManage.WebAPI.Models;

public class RegisterModel : ICommand<Response<NoContentData>>
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public IEnumerable<string> Roles { get; set; } = new HashSet<string>();
    public long CompanyId { get; set; }
}