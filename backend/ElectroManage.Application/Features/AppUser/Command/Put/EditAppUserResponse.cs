using ElectroManage.Application.DTO_s;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.Features.AppUser.Command.Put;

public record EditAppUserResponse
{
    public long Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public CompanyDTO Company { get; set; } = null!;
}
