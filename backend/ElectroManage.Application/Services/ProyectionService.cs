using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Domain.Entites.Sucursal;

namespace ElectroManage.Application.Services;

/// <summary>
/// Service to calculate future consumption projections for a company.
/// </summary>
[RegisterService<IProyectionService>(LifeTime.Scoped)]
public class ProyectionService : IProyectionService
{
    /// <summary>
    /// Calculates future consumption projections for a company over a specified number of months.
    /// </summary>
    /// <param name="company">The company for which to calculate projections.</param>
    /// <returns>An enumerable of <see cref="ProyectionDTO"/> containing the future consumption projections.</returns>
    public IEnumerable<ProyectionDTO> CalculateProyectionsAsync(Company company)
    {
        int daysInMonth = 30; // Assume 30 days in a month for prediction
        int monthsToPredict = 3; // Number of months to predict
        int daysToPredict = daysInMonth * monthsToPredict; // Total days to predict

        // Filter and order the consumption records for the last 5 years
        var consumption = company.Registers
            .Where(r => r.Date.Year >= DateTime.UtcNow.Year - 5 && r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active)
            .OrderBy(r => r.Date) 
            .Select(r => r.Consumption)
            .ToList();

        // Return an empty list if there is no consumption data
        if (!consumption.Any())
            return Enumerable.Empty<ProyectionDTO>();

        // Prepare the x values for linear regression
        List<double> x = new List<double>();
        for (int i = 0; i < consumption.Count; i++)
        {
            x.Add(i);
        }

        // Fit a linear model to the consumption data
        var coefficients = Fit(x, consumption);

        var response = new ProyectionDTO[monthsToPredict];
        int n = consumption.Count; // Start predicting from the end of the current data

        // Predict future consumption for each month
        for (int month = 0; month < monthsToPredict; month++)
        {
            double predictedValueMonth = 0;
            for (int day = 0; day < daysInMonth; day++)
            {
                // Predict daily consumption and accumulate for the month
                double dailyPrediction = Predict(n, coefficients);
                predictedValueMonth += dailyPrediction;
                n++;
            }
            // Store the prediction in the response array
            response[month] = new ProyectionDTO
            {
                Month = DateTime.UtcNow.AddMonths(month + 1).Month,
                FutureConsumption = Math.Round(predictedValueMonth, 1)
            };
        }
        return response;
    }

    /// <summary>
    /// Fits a linear regression model to the given data.
    /// </summary>
    /// <param name="x">The x values (independent variable).</param>
    /// <param name="y">The y values (dependent variable).</param>
    /// <returns>A tuple containing the slope and intercept of the fitted line.</returns>
    private Tuple<double, double> Fit(List<double> x, List<double> y)
    {
        double xMean = x.Average(); // Calculate the mean of x values
        double yMean = y.Average(); // Calculate the mean of y values
        double sumXy = 0;
        double sumX2 = 0;

        // Calculate the sums needed for the slope
        for (int i = 0; i < x.Count; i++)
        {
            sumXy += (x[i] - xMean) * (y[i] - yMean);
            sumX2 += Math.Pow(x[i] - xMean, 2);
        }

        // Calculate the slope and intercept of the line
        double slope = sumX2 == 0 ? 0 : sumXy / sumX2;
        double intercept = yMean - slope * xMean;

        return new Tuple<double, double>(slope, intercept);
    }

    /// <summary>
    /// Predicts the consumption for a given day using the linear model.
    /// </summary>
    /// <param name="x">The day index for which to predict consumption.</param>
    /// <param name="coefficients">The coefficients of the linear model.</param>
    /// <returns>The predicted consumption value, ensuring it is not negative.</returns>
    private double Predict(double x, Tuple<double, double> coefficients)
    {
        // Calculate the predicted value and ensure it's not negative
        return Math.Max(coefficients.Item1 * x + coefficients.Item2, 0);
    }
}