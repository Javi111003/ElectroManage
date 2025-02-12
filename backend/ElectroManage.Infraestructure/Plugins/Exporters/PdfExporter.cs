﻿using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using SelectPdf;

namespace ElectroManage.Infraestructure.Plugins.Exporters;
public class PdfExporter : IExporter
{ 
    public string Format => "pdf";
    public byte[] Export(string data)
    {
        try
        {
            // Crear una instancia del convertidor HTML a PDF
            HtmlToPdf converter = new HtmlToPdf();

            // Convertir el HTML a un documento PDF
            PdfDocument doc = converter.ConvertHtmlString(data);

            // Guardar el documento PDF en un array de bytes
            byte[] pdf = doc.Save();

            // Cerrar el documento para liberar recursos
            doc.Close();

            return pdf;
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.ToString());
            throw;
        }
    }
}
