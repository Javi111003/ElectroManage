using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;

namespace ElectroManage.Application.Services;

[RegisterService<IProyectionService>(LifeTime.Scoped)]
public class ProyectionService : IProyectionService
{
    public IEnumerable<ProyectionDTO> CalculateProyectionsAsync(Company company)
    {
        int daysInMonth = 30;
        int monthsToPredict = 3;
        int daysToPredict = daysInMonth * monthsToPredict;

        var consumption = company.Registers
            .Where(r => r.Date.Year >= DateTime.UtcNow.Year - 5 && r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active)
            .OrderBy(r => r.Date) 
            .Select(r => r.Consumption)
            .ToList();

        if (!consumption.Any())
            return Enumerable.Empty<ProyectionDTO>();

        List<double> x = new List<double>();
        for (int i = 0; i < consumption.Count; i++)
        {
            x.Add(i);
        }
        var coefficients = Fit(x, consumption);

        var response = new ProyectionDTO[monthsToPredict];
        int n = consumption.Count;
        for (int month = 0; month < monthsToPredict; month++)
        {
            double predictedValueMonth = 0;
            for (int day = 0; day < daysInMonth; day++)
            {
                double dailyPrediction = Predict(n, coefficients);
                predictedValueMonth += dailyPrediction;
                n++;
            }
            response[month] = new ProyectionDTO
            {
                Month = DateTime.UtcNow.AddMonths(month + 1).Month,
                FutureConsumption = Math.Round(predictedValueMonth,1)
            };
        }
        return response;
    }

    private Tuple<double, double> Fit(List<double> x, List<double> y)
    {
        double xMean = x.Average();
        double yMean = y.Average();
        double sumXy = 0;
        double sumX2 = 0;

        for (int i = 0; i < x.Count; i++)
        {
            sumXy += (x[i] - xMean) * (y[i] - yMean);
            sumX2 += Math.Pow(x[i] - xMean, 2);
        }

        double slope = sumX2 == 0 ? 0 : sumXy / sumX2;
        double intercept = yMean - slope * xMean;

        return new Tuple<double, double>(slope, intercept);
    }

    private double Predict(double x, Tuple<double, double> coefficients)
    {
        return Math.Max(coefficients.Item1 * x + coefficients.Item2, 0);
    }
}