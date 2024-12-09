namespace ElectroManage.Application.Features.Company.Command.Put;

public record EditGeneralDataCompanyResponse
{
    public string Name { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Installation {  get; set; } = string.Empty;
    public string Location {  get; set; } = string.Empty;

    //TO DO: Cambiar por un Location DTO
}
