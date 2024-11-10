namespace ElectroManage.Domain.Settings;
public record HangFireSettings
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}