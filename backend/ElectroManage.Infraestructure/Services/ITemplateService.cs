namespace ElectroManage.Infraestructure.Services;
public interface ITemplateService
{
    public string GetAlertsTemplate(Domain.Entites.Identity.AppUser user, Domain.Entites.Sucursal.Company company);
}