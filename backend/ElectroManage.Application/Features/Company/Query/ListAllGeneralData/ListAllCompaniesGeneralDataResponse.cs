using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ListAllGeneralData;

public record ListAllCompaniesGeneralDataResponse
{
    public IEnumerable<CompanyGeneralDataDTO> Companies { get; set; } = new HashSet<CompanyGeneralDataDTO>();
}
