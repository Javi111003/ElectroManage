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
    public string GetCompaniesTemplate(Domain.Entites.Identity.AppUser user, List<Domain.Entites.Sucursal.Company> companies);
    public string GetOfficesTemplate(Domain.Entites.Identity.AppUser user, List<Domain.Entites.Offices.Office> offices, string officeCompanyName);
    public string GetEquipmentsTemplate(Domain.Entites.Identity.AppUser user, List<Domain.Entites.Equipment.EquipmentInstance> equipments, string equipmentCompanyName, string equipmentOfficeName);
    public string GetPolicyComparisonTemplate(Domain.Entites.Identity.AppUser user, Domain.Entites.Sucursal.EfficiencyPolicy policy, List<Domain.Entites.Sucursal.Register> registersBefore, List<Domain.Entites.Sucursal.Register> registersAfter, string policyCompanyName);
    public string GetPoliciesTemplate(Domain.Entites.Identity.AppUser user, List<Domain.Entites.Sucursal.EfficiencyPolicy> policies);
}