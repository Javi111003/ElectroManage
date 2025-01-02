namespace ElectroManage.Application.Features.Company.Query.GetRegisters;

public record GetRegisterByCompanyCommand : ICommand<GetRegisterByCompanyResponse>
{
    public long Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
