using ElectroManage.Domain.DataAccess.Abstractions;
using FastEndpoints;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.Common;
using ElectroManage.Domain.DataAccess.Concrete;

namespace ElectroManage.Domain.DataAccess
{
    /// <summary>
    /// Implements the Unit of Work pattern to manage database transactions and repositories
    /// </summary>
    [RegisterService<IUnitOfWork>(LifeTime.Scoped)]
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private readonly Dictionary<Type, ICommitable> _repositories;
        private IDbContextTransaction? _transaction;
        protected bool IsDisposed { get; private set; }

        /// <summary>
        /// Initializes a new instance of the UnitOfWork class
        /// </summary>
        /// <param name="context">The database context to use</param>
        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            _repositories = new Dictionary<Type, ICommitable>();
            _transaction = null;
        }

        /// <summary>
        /// Gets or creates a repository for the specified entity type
        /// </summary>
        /// <typeparam name="TEntity">The type of entity for the repository</typeparam>
        /// <returns>A repository instance for the specified entity type</returns>
        public IGenericCoreRepositoryAsync<TEntity> DbRepository<TEntity>() where TEntity : class
        {
            Type type = typeof(TEntity);

            if (!_repositories.ContainsKey(type))
            {
                Type implementationType = typeof(GenericCoreRepository<>).MakeGenericType(typeof(TEntity));

                object? instance = Activator.CreateInstance(implementationType, _context);

                if (instance != null)
                {
                    _repositories.Add(type, (ICommitable)instance);
                }
            }
            return (IGenericCoreRepositoryAsync<TEntity>)_repositories[type];
        }

        /// <summary>
        /// Begins a new database transaction
        /// </summary>
        public void BeginTransaction()
        {
            DbConnection connection = _context.Database.GetDbConnection();
            if (connection.State != ConnectionState.Open)
            {
                connection.Open();
            }

            _transaction = _context.Database.BeginTransaction(IsolationLevel.Unspecified);
        }

        /// <summary>
        /// Rolls back the current transaction
        /// </summary>
        public void RollBack() => _transaction?.Rollback();

        /// <summary>
        /// Commits the current transaction
        /// </summary>
        /// <returns>True if the commit was successful</returns>
        public bool CommitTransaction()
        {
            _transaction?.Commit();
            return true;
        }

        /// <summary>
        /// Disposes of the UnitOfWork and its resources
        /// </summary>
        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Protected implementation of the dispose pattern
        /// </summary>
        /// <param name="disposing">True if called from Dispose(), false if called from finalizer</param>
        protected virtual void Dispose(bool disposing)
        {
            if (!IsDisposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                    _transaction?.Dispose();
                }
                IsDisposed = true;
            }
        }

        /// <summary>
        /// Saves all pending changes to the database
        /// </summary>
        public void Save() => _context.SaveChanges();

        /// <summary>
        /// Asynchronously saves all pending changes to the database
        /// </summary>
        /// <param name="cancellationToken">A token to cancel the operation</param>
        /// <returns>A task representing the save operation with the number of affected records</returns>
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) => _context.SaveChangesAsync(cancellationToken);

        /// <summary>
        /// Commits all changes from registered repositories
        /// </summary>
        /// <param name="autoRollbackOnError">If true, automatically rolls back on error</param>
        /// <returns>The total number of changes committed</returns>
        public virtual int CommitChanges(bool autoRollbackOnError = true)
        {
            int result;
            try
            {
                result = _repositories.Values.Sum((ICommitable factory) => factory.Commit());
            }
            catch (Exception)
            {
                if (autoRollbackOnError)
                {
                    this.RollBack();
                }
                throw;
            }
            return result;
        }

        /// <summary>
        /// Asynchronously commits all pending changes from all registered repositories
        /// </summary>
        /// <param name="autoRollbackOnError">If true, automatically rolls back all changes if any repository fails to commit</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains
        /// the total number of changes committed across all repositories
        /// </returns>
        /// <exception cref="Exception">
        /// Rethrows any exception that occurs during the commit process after attempting rollback (if autoRollbackOnError is true)
        /// </exception>
        public virtual async Task<int> CommitChangesAsync(bool autoRollbackOnError = true)
        {
            int result;
            try
            {
                int num = 0;
                foreach (ICommitable current in this._repositories.Values)
                {
                    num += await current.CommitAsync();
                }
                result = num;
            }
            catch (Exception)
            {
                if (autoRollbackOnError)
                {
                    this.RollBack();
                }
                throw;
            }
            return result;
        }
    }
}
