using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using SelectPdf;

namespace ElectroManage.Infraestructure.Plugins.Exporters;
public class PdfExporter : IExporter
{ 
    private readonly ILogger _logger;
    public PdfExporter()
    {
        var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
        _logger = loggerFactory.CreateLogger<PdfExporter>();
    }
    public string Format => "pdf";
    public byte[] Export(string data)
    {
        try
        {
            // Crear una instancia del convertidor HTML a PDF
            HtmlToPdf converter = new HtmlToPdf();

            // Convertir el HTML a un documento PDF
            PdfDocument doc = converter.ConvertHtmlString("<h1>Prueba PDF</h1>");

            // Guardar el documento PDF en un array de bytes
            byte[] pdf = doc.Save();

            // Cerrar el documento para liberar recursos
            doc.Close();

            return pdf;
        }
        catch(Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }
}
