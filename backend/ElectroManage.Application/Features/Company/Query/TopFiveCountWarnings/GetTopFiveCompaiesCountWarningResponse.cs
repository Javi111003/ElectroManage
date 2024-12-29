using ElectroManage.Application.DTO_s;
namespace ElectroManage.Application.Features.Company.Query.TopFiveCountWarnings;

public record GetTopFiveCompaiesCountWarningResponse
{
    public IEnumerable<TopFiveCompaniesCountWarningDTO> TopFiveCompaniesCountWarnings { get; set; } = new HashSet<TopFiveCompaniesCountWarningDTO>();
}
