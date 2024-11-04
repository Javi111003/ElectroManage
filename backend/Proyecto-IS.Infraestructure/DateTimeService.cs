using FastEndpoints;
using Proyecto_IS.Common.Interfaces;

namespace Proyecto_IS.Infraestructure.Services;

[RegisterService<IDateTimeService>(LifeTime.Singleton)]
public class DateTimeService : IDateTimeService
{
    public DateTime NowUtc => throw new NotImplementedException();
}