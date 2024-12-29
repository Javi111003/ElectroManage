using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Office.Query.ListAll;
public record ListOfficeByCompanyQuery : ICommand<IEnumerable<OfficeDTO>>
{
    public long CompanyId { get; set; }
}