namespace ElectroManage.Application.Features.Company.Query.CountDeleteCompanies;

public record CountDeleteCompaniesCommand : ICommand<CountDeleteCompaniesResponse>
{
    public long Year { get; set; }
}
