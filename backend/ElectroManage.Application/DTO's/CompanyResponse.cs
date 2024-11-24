namespace ElectroManage.Application.DTO_s;
public record CompanyResponse 
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
}