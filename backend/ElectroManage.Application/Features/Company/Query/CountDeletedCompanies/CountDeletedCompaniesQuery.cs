namespace ElectroManage.Application.Features.Company.Query.CountDeletedCompanies;

public record CountDeletedCompaniesQuery : ICommand<CountDeletedCompaniesResponse>
{
    public long Year { get; set; }
}
