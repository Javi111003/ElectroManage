using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.CountDeletedCompanies;
public record CountDeletedCompaniesResponse
{
    public long Year { get; set; }
    public long CreatedComapniesThisYear { get; set; }
    public long ExistingCompaniesThisYear { get; set; }
    public long DeletedCompaniesThisYear { get; set; }
    public IEnumerable<CountCreatedDeletedCompaniesByMonthDTO> CompaniesByMonth { get; set; } = new HashSet<CountCreatedDeletedCompaniesByMonthDTO>();
}