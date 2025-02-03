using static ElectroManage.Infraestructure.Concrete.TemplateService;

namespace ElectroManage.Infraestructure.Services;
public interface ITemplateService
{
    public string GetAlertsTemplate(Domain.Entites.Identity.AppUser user, Domain.Entites.Sucursal.Company company);
    public string GetTotalConsumptionTemplate(Domain.Entites.Identity.AppUser user, Domain.Entites.Sucursal.Company company, DateTime startDate, DateTime endDate);
    public string GetAvgConsumptionTemplate(Domain.Entites.Identity.AppUser user, IEnumerable<Domain.Entites.Sucursal.Company> companies);
    public string GetPredictionTemplate(Domain.Entites.Identity.AppUser user, IEnumerable<CompanyWithProyections> companies);
    public string GetExcessTemplate(Domain.Entites.Identity.AppUser user, IEnumerable<IGrouping<long, Domain.Entites.Sucursal.Warning>> warningsByCompany, DateTime date);
    public string GetUsersTemplate(Domain.Entites.Identity.AppUser user, IEnumerable<Domain.Entites.Identity.AppUser> users);
}