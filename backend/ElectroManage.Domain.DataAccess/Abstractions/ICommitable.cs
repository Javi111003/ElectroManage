namespace ElectroManage.Domain.DataAccess.Abstractions;
public interface ICommitable : IDisposable
{
    bool IsDisposed { get; }
    int Commit();
    Task<int> CommitAsync();
}