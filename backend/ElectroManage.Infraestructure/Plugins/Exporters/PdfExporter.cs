using ElectroManage.Infraestructure.Services;

namespace ElectroManage.Infraestructure.Plugins.Exporters;
public class PdfExporter : IExporter
{
    public string Format => "pdf";
    public byte[] Export(string data)
    {
        throw new NotImplementedException();
    }
}