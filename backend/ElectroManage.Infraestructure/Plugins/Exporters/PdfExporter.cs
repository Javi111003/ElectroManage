using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using SelectPdf;

namespace ElectroManage.Infraestructure.Plugins.Exporters
{
    /// <summary>
    /// Provides functionality to export data to a PDF format
    /// </summary>
    public class PdfExporter : IExporter
    {
        /// <summary>
        /// Gets the format of the export, which is "pdf"
        /// </summary>
        public string Format => "pdf";

        /// <summary>
        /// Exports the provided data as a PDF document
        /// </summary>
        /// <param name="data">The HTML string data to be converted into a PDF</param>
        /// <returns>A byte array representing the generated PDF document</returns>
        /// <exception cref="Exception">Throws an exception if the PDF conversion fails</exception>
        public byte[] Export(string data)
        {
            try
            {
                // Create an instance of the HTML to PDF converter
                HtmlToPdf converter = new HtmlToPdf();

                // Convert the HTML to a PDF document
                PdfDocument doc = converter.ConvertHtmlString(data);

                // Save the PDF document to a byte array
                byte[] pdf = doc.Save();

                // Close the document to free resources
                doc.Close();

                return pdf;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }
    }
}
