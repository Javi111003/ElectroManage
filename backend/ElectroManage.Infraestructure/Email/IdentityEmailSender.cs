using Microsoft.AspNetCore.Identity;
using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Infraestructure.Email;
public class IdentityEmailSender : IEmailSender<AppUser>
{
    public Task SendConfirmationLinkAsync(AppUser user, string email, string confirmationLink)
    {
        // Implementar la lógica para enviar un correo electrónico aquí.
        // Por ejemplo, un servicio de correo electrónico como SendGrid, SMTP, etc.

        // Simulación de envío de correo electrónico
        Console.WriteLine($"Enviando correo de confirmación a {email} con el enlace: {confirmationLink}");

        return Task.CompletedTask;
    }

    public Task SendPasswordResetCodeAsync(AppUser user, string email, string resetCode)
    {
        // Implementar la lógica para enviar un correo electrónico aquí.
        Console.WriteLine($"Enviando código de restablecimiento de contraseña a {email} con el código: {resetCode}");

        return Task.CompletedTask;
    }

    public Task SendPasswordResetLinkAsync(AppUser user, string email, string resetLink)
    {
        // Implementar la lógica para enviar un correo electrónico aquí.
        Console.WriteLine($"Enviando enlace de restablecimiento de contraseña a {email} con el enlace: {resetLink}");

        return Task.CompletedTask;
    }
}