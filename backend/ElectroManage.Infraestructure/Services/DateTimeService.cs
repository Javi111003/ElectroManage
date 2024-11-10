using FastEndpoints;
using ElectroManage.Common.Interfaces;

namespace ElectroManage.Infraestructure.Services;

[RegisterService<IDateTimeService>(LifeTime.Singleton)]
public class DateTimeService : IDateTimeService
{
    public DateTime NowUtc => DateTime.UtcNow;
}