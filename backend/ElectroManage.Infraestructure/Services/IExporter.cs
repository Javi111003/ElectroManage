using ElectroManage.Domain.Enums;

namespace ElectroManage.Infraestructure.Services;
/// <summary>
/// Interface for exporting data to a defined format.
/// </summary>
public interface IExporter
{
    /// <summary>
    /// Gets the format to which the data will be exported.
    /// </summary>
    public string Format => string.Empty;

    /// <summary>
    /// Exports the given data to the defined format.
    /// </summary>
    /// <param name="data">The data to be exported.</param>
    /// <returns>A byte array containing the exported data.</returns>
    public byte[] Export(string data);
}