using ElectroManage.Domain.Enums;
using ElectroManage.Infraestructure.Services;
using FastEndpoints;
using User = ElectroManage.Domain.Entites.Identity.AppUser;

namespace ElectroManage.Infraestructure.Concrete;

[RegisterService<ITemplateService>(LifeTime.Scoped)]
public class TemplateService : ITemplateService
{
    readonly string AlertsTemplateUrl;
    readonly string AvgConsumptionTemplateUrl;
    readonly string CompaniesTemplateUrl;
    readonly string EquipmentsTemplateUrl;
    readonly string ExcessTemplateUrl;
    readonly string HeaderTemplateUrl;
    readonly string OfficeTemplateUrl;
    readonly string PoliciesTemplateUrl;
    readonly string PolicyComparissionTemplateUrl;
    readonly string TablePerCenterTemplateUrl;
    readonly string TotalConsumptionTemplateUrl;
    readonly string UsersTemplateUrl;
    readonly string LogoUrl;
    public TemplateService()
    {
#if DEBUG
        AlertsTemplateUrl = "./../ElectroManage.Infraestructure/Templates/alerts.html";
        AvgConsumptionTemplateUrl = "./../ElectroManage.Infraestructure/Templates/avg-consumption.html";
        CompaniesTemplateUrl = "./../ElectroManage.Infraestructure/Templates/companies.html";
        EquipmentsTemplateUrl = "./../ElectroManage.Infraestructure/Templates/equipments.html";
        ExcessTemplateUrl = "./../ElectroManage.Infraestructure/Templates/excess.html";
        HeaderTemplateUrl = "./../ElectroManage.Infraestructure/Templates/header.html";
        OfficeTemplateUrl = "./../ElectroManage.Infraestructure/Templates/office.html";
        PoliciesTemplateUrl = "./../ElectroManage.Infraestructure/Templates/policies.html";
        PolicyComparissionTemplateUrl = "./../ElectroManage.Infraestructure/Templates/policy-comparison.html";
        TablePerCenterTemplateUrl = "./../ElectroManage.Infraestructure/Templates/table-per-center.html";
        TotalConsumptionTemplateUrl = "./../ElectroManage.Infraestructure/Templates/total-consumption.html";
        UsersTemplateUrl = "./../ElectroManage.Infraestructure/Templates/users.html";
        LogoUrl = "./../ElectroManage.Infraestructure/Templates/logo.png";
#else
        AlertsTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "alerts.html");
        AvgConsumptionTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "avg-consumption.html");
        CompaniesTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "companies.html");
        EquipmentsTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "equipments.html");
        ExcessTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "excess.html");
        HeaderTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "header.html");
        OfficeTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "office.html");
        PoliciesTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "policies.html");
        PolicyComparissionTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "policy-comparison.html");
        TablePerCenterTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "table-per-center.html");
        TotalConsumptionTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "total-consumption.html");
        UsersTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "users.html");
        LogoUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "logo.png");
#endif
    }

    public string GetAlertsTemplate(User user, Domain.Entites.Sucursal.Company company)
    {
        var header = GetHeaderTemplate(user);
        var htmlAlert = File.ReadAllText(AlertsTemplateUrl);
        var alerts = company.Warnings.Where(w => w.StatusBaseEntity == StatusEntityType.Active)
                           .Select(w => $"<tr><td>{w.Created.Month}/{w.Created.Year}</td><td>Consumo {w.Consumption}</td><td>Límite {w.EstablishedLimit}</td><td>Exceso {w.Consumption - w.EstablishedLimit}</td></tr>");
       
        htmlAlert = htmlAlert.Replace("{{header}}", header)
                             .Replace("{{fromCompany}}", company.Name)
                             .Replace("{{rows}}", string.Join("", alerts));
        return htmlAlert;
    }
    private string GetHeaderTemplate(User user)
    {
        var html = File.ReadAllText(HeaderTemplateUrl);
        html = html.Replace("{{user_name}}", user.UserName)
                   .Replace("{{email}}", user.Email)
                   .Replace("{{companyName}}", user.Company.Name)
                   .Replace("{{logo}}", LogoUrl);
        return html;
    }
}