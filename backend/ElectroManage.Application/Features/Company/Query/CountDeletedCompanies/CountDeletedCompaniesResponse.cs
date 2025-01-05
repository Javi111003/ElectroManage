namespace ElectroManage.Application.Features.Company.Query.CountDeletedCompanies;
public record CountDeletedCompaniesResponse
{
    public long CreatedComapniesThisYear { get; set; }
    public long ExistingCompaniesThisYear { get; set; }
    public long DeletedCompaniesThisYear { get; set; }
}