using System.Collections;

namespace ElectroManage.Domain.DataAccess.Concrete;

public static class CollectionUtils
{
    public static bool IsNullOrEmpty<T>(IEnumerable<T>? source)
    {
        return source is null || !source.Any<T>();
    }
    public static bool IsNullOrEmpty(IEnumerable? source)
    {
        return source == null || !source.GetEnumerator().MoveNext();
    }
}