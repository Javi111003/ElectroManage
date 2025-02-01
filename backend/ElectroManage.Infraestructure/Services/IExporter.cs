using ElectroManage.Domain.Enums;

namespace ElectroManage.Infraestructure.Services;
public interface IExporter
{
    public string Format => string.Empty;
    public byte[] Export(string data);
}