namespace ElectroManage.Application.Features.Company.Query.Get;

public record CompanyGetByIdCommand : ICommand<CompanyGetByIdResponse>
{
    public long Id { get; set; }
}
