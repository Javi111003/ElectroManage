using static ElectroManage.Infraestructure.Concrete.TemplateService;

namespace ElectroManage.Infraestructure.Services;
/// <summary>
/// Interface for template services.
/// </summary>
public interface ITemplateService
{
    /// <summary>
    /// Gets the alerts template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="company">The company.</param>
    /// <returns>The alerts template as a string.</returns>
    public string GetAlertsTemplate(Domain.Entites.Identity.AppUser user, Domain.Entites.Sucursal.Company company);

    /// <summary>
    /// Gets the total consumption template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="company">The company.</param>
    /// <param name="startDate">The start date.</param>
    /// <param name="endDate">The end date.</param>
    /// <returns>The total consumption template as a string.</returns>
    public string GetTotalConsumptionTemplate(Domain.Entites.Identity.AppUser user, Domain.Entites.Sucursal.Company company, DateTime startDate, DateTime endDate);

    /// <summary>
    /// Gets the average consumption template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="companies">The companies.</param>
    /// <returns>The average consumption template as a string.</returns>
    public string GetAvgConsumptionTemplate(Domain.Entites.Identity.AppUser user, IEnumerable<Domain.Entites.Sucursal.Company> companies);

    /// <summary>
    /// Gets the prediction template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="companies">The companies with projections.</param>
    /// <returns>The prediction template as a string.</returns>
    public string GetPredictionTemplate(Domain.Entites.Identity.AppUser user, IEnumerable<CompanyWithProyections> companies);

    /// <summary>
    /// Gets the excess template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="warningsByCompany">The warnings grouped by company.</param>
    /// <param name="date">The date.</param>
    /// <returns>The excess template as a string.</returns>
    public string GetExcessTemplate(Domain.Entites.Identity.AppUser user, IEnumerable<IGrouping<long, Domain.Entites.Sucursal.Warning>> warningsByCompany, DateTime date);

    /// <summary>
    /// Gets the users template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="users">The users.</param>
    /// <returns>The users template as a string.</returns>
    public string GetUsersTemplate(Domain.Entites.Identity.AppUser user, IEnumerable<Domain.Entites.Identity.AppUser> users);

    /// <summary>
    /// Gets the companies template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="companies">The companies.</param>
    /// <returns>The companies template as a string.</returns>
    public string GetCompaniesTemplate(Domain.Entites.Identity.AppUser user, List<Domain.Entites.Sucursal.Company> companies);

    /// <summary>
    /// Gets the offices template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="offices">The offices.</param>
    /// <param name="officeCompanyName">The office company name.</param>
    /// <returns>The offices template as a string.</returns>
    public string GetOfficesTemplate(Domain.Entites.Identity.AppUser user, List<Domain.Entites.Offices.Office> offices, string officeCompanyName);

    /// <summary>
    /// Gets the equipments template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="equipments">The equipments.</param>
    /// <param name="equipmentCompanyName">The equipment company name.</param>
    /// <param name="equipmentOfficeName">The equipment office name.</param>
    /// <returns>The equipments template as a string.</returns>
    public string GetEquipmentsTemplate(Domain.Entites.Identity.AppUser user, List<Domain.Entites.Equipment.EquipmentInstance> equipments, string equipmentCompanyName, string equipmentOfficeName);

    /// <summary>
    /// Gets the policy comparison template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="policy">The efficiency policy.</param>
    /// <param name="registersBefore">The registers before the policy.</param>
    /// <param name="registersAfter">The registers after the policy.</param>
    /// <param name="policyCompanyName">The policy company name.</param>
    /// <returns>The policy comparison template as a string.</returns>
    public string GetPolicyComparisonTemplate(Domain.Entites.Identity.AppUser user, Domain.Entites.Sucursal.EfficiencyPolicy policy, List<Domain.Entites.Sucursal.Register> registersBefore, List<Domain.Entites.Sucursal.Register> registersAfter, string policyCompanyName);

    /// <summary>
    /// Gets the policies template.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="policies">The efficiency policies.</param>
    /// <returns>The policies template as a string.</returns>
    public string GetPoliciesTemplate(Domain.Entites.Identity.AppUser user, List<Domain.Entites.Sucursal.EfficiencyPolicy> policies);
}