using System;
namespace ElectroManage.Application.Features.AppUser.Query.Export.List;
public class ExportListAppUsersCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public string Format { get; set; } = "pdf";
}