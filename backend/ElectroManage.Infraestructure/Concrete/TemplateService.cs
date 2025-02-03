using ElectroManage.Common.Dtos;
using ElectroManage.Domain.Entites.Sucursal;
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
    readonly string PredictionTemplateUrl;
    readonly string PredictionTableTemplateUrl;
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
        PredictionTemplateUrl = "./../ElectroManage.Infraestructure/Templates/prediction.html";
        PredictionTableTemplateUrl = "./../ElectroManage.Infraestructure/Templates/prediction-table.html";
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
        PredictionTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "prediction.html");
        PredictionTableTemplateUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "prediction-table.html");
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
                           .Select(w => $"<tr><td>{w.Created.Month}/{w.Created.Year}</td><td>{w.Consumption}</td><td>{w.EstablishedLimit}</td><td>Exceso {w.Consumption - w.EstablishedLimit}</td></tr>");
       
        htmlAlert = htmlAlert.Replace("{{header}}", header)
                             .Replace("{{fromCompany}}", company.Name)
                             .Replace("{{rows}}", string.Join("", alerts));
        return htmlAlert;
    }
    public string GetTotalConsumptionTemplate(User user, Domain.Entites.Sucursal.Company company,DateTime startDate, DateTime endDate)
    {
        var header = GetHeaderTemplate(user);
        var htmlTotalConsumption = File.ReadAllText(TotalConsumptionTemplateUrl);
        var registers = company.Registers.Where(r => r.StatusBaseEntity == StatusEntityType.Active && r.Date.Date >= startDate.Date && r.Date.Date <= endDate.Date);
        var totalConsumption = registers.Where(r => r.StatusBaseEntity == StatusEntityType.Active).Sum(r => r.Consumption);
        var totalCost = registers.Sum(r => r.Cost);
        var rows = registers.Select(r => $"<tr><td>{r.Date}</td><td>{r.Consumption}</td><td>{r.Cost}</td></tr>");
        htmlTotalConsumption = htmlTotalConsumption.Replace("{{header}}", header)
                                                   .Replace("{{fromCompany}}", company.Name)
                                                   .Replace("{{startDate}}", startDate.ToString())
                                                   .Replace("{{endDate}}", endDate.ToString())
                                                   .Replace("{{total-consumption}}", totalConsumption.ToString())
                                                   .Replace("{{total-cost}}", totalCost.ToString())
                                                   .Replace("{{rows}}", string.Join("", rows));
        return htmlTotalConsumption;
    }
    public string GetAvgConsumptionTemplate(User user, IEnumerable<Domain.Entites.Sucursal.Company> companies)
    {
        var header = GetHeaderTemplate(user);
        var htmlAvgConsumption = File.ReadAllText(AvgConsumptionTemplateUrl);
        var htmlTablePerCenter = File.ReadAllText(TablePerCenterTemplateUrl);
        var rows = "";
        foreach (var company in companies)
        {
            var registers = company.Registers.Where(r => r.StatusBaseEntity == StatusEntityType.Active);
            var years = "";
            int year = DateTime.Now.Year - 1;
            while (year > DateTime.Now.Year - 4)
            {
                var yearRegisters = registers.Where(r => r.Date.Year == year).OrderByDescending(r => r.Date);
                var meanConsumption = yearRegisters.Where(x => x.Date.Year == year).Sum(x => x.Cost) / 12;
                var meanCost = yearRegisters.Where(x => x.Date.Year == year).Sum(x => x.Consumption) / 12;
                years += $"<tr><td>{year.ToString()}</td><td>{meanConsumption}</td><td>{meanCost}</td></tr>";
                year -= 1;
            }
            rows += htmlTablePerCenter.Replace("{{companyName}}", $"Sucursal {company.Name}")
                                       .Replace("{{rows}}", years);
        }
        htmlAvgConsumption = htmlAvgConsumption.Replace("{{header}}", header)
                                               .Replace("{{companyNumber}}", companies.Count().ToString())
                                               .Replace("{{tablePerCenter}}", rows);
        return htmlAvgConsumption;
    }
    public string GetPredictionTemplate(Domain.Entites.Identity.AppUser user, IEnumerable<CompanyWithProyections> companies)
    {
        var header = GetHeaderTemplate(user);
        var htmlPrediction = File.ReadAllText(PredictionTemplateUrl);
        var htmlPredictionTable = File.ReadAllText(PredictionTableTemplateUrl);
        var rows = "";
        foreach (var company in companies)
        {
            var proyections = company.Proyections.Select(p => $"<tr><td>{p.Month}</td><td>{p.FutureConsumption}</td></tr>");
            rows += htmlPredictionTable.Replace("{{companyName}}", $"Sucursal {company.CompanyName}")
                                        .Replace("{{rows}}", string.Join("", proyections));
        }
        htmlPrediction = htmlPrediction.Replace("{{header}}", header)
                                       .Replace("{{companyNumber}}", companies.Count().ToString())
                                       .Replace("{{predictionTables}}", rows);
        return htmlPrediction;
    }
    public string GetExcessTemplate(User user, IEnumerable<IGrouping<long, Domain.Entites.Sucursal.Warning>> warningsByCompany,DateTime date)
    {
        var header = GetHeaderTemplate(user);
        var htmlExcess = File.ReadAllText(ExcessTemplateUrl);
        var rows = "";
        foreach (var warning in warningsByCompany)
        {
            foreach(var excess in warning)
            {
                var excessConsumption = excess.Consumption - excess.EstablishedLimit;
                rows += $"<tr><td>{excess.Company.Name}</td><td>{excess.Consumption}</td><td>{excess.EstablishedLimit}</td><td>{excessConsumption}</td></tr>";
            }
        }
        htmlExcess = htmlExcess.Replace("{{header}}", header)
                               .Replace("{{rows}}", rows)
                               .Replace("{{month}}", date.Month.ToString())
                               .Replace("{{year}}", date.Year.ToString());
        return htmlExcess;
    }
    public string GetUsersTemplate(User appUser, IEnumerable<User> users)
    {
        var htmlHeader = GetHeaderTemplate(appUser);
        var htmlUsers = File.ReadAllText(UsersTemplateUrl);
        var rows = "";
        foreach (var user in users)
        {
            rows += $"<tr><td>{user.UserName}</td><td>{user.Email}</td><td>{user.Company.Name}</td></tr>";
        }
        htmlUsers = htmlUsers.Replace("{{header}}", htmlHeader)
                             .Replace("{{rows}}", rows);
        return htmlUsers;
    }
    private string GetHeaderTemplate(User user)
    {
        var html = File.ReadAllText(HeaderTemplateUrl);
        html = html.Replace("{{username}}", user.UserName)
                   .Replace("{{email}}", user.Email)
                   .Replace("{{companyName}}", user.Company.Name)
                   .Replace("{{logo}}", LogoUrl);
        return html;
    }
    public record CompanyWithProyections
    {
        public long CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public IEnumerable<ProyectionInfo> Proyections { get; set; } = new HashSet<ProyectionInfo>();
    }
    public record ProyectionInfo
    {
        public int Month { get; set; }
        public double FutureConsumption { get; set; }
    }
}