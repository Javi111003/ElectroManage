namespace ElectroManage.Application.Features.Company.Query.Get;
using ElectroManage.Application.DTO_s;

public record CompanyGetByIdCommand : ICommand<CompanyResponse>
{
    public long Id { get; set; }
}
