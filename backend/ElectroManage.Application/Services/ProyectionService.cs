using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;

namespace ElectroManage.Application.Services;

[RegisterService<IProyectionService>(LifeTime.Scoped)]
public class ProyectionService : IProyectionService
{
    public async Task<IEnumerable<ProyectionDTO>> CalculateProyectionsAsync(Company company)
    {
        int daysInMonth = 30;
        int monthsToPredict = 3;
        int daysToPredict = daysInMonth * monthsToPredict;

        var consumption = company.Registers.Where(r => r.Date.Year >= DateTime.UtcNow.Year - 5)
            .Select(r => r.Consumption).ToList();

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
                predictedValueMonth += Predict(n, coefficients);
                n++;
            }
            response[month] = new ProyectionDTO
            {
                Month = DateTime.UtcNow.Month + month + 1,
                FutureConsumption = predictedValueMonth,
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

        double slope = sumXy / sumX2;
        double intercept = yMean - slope * xMean;

        return new Tuple<double, double>(slope, intercept);
    }
    private double Predict(double x, Tuple<double, double> coefficients)
    {
        return coefficients.Item1 * x + coefficients.Item2;
    }
}
