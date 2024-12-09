
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Office.Query.Get;

public class OfficeGetByIdCommandHandler : CoreCommandHandler<OfficeGetByIdCommand, OfficeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<OfficeGetByIdCommandHandler> _logger;

    public OfficeGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<OfficeGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<OfficeResponse> ExecuteAsync(OfficeGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();
        var includes = new List<Expression<Func<Domain.Entites.Offices.Office, object>>>
        {
            x => x.Company
        };
        var office = await officeRepository.FirstAsync(useInactive: true, includes: includes, filters: x => x.Id == command.Id);
        if (office is null)
        {
            _logger.LogError($"Office with id {command.Id} not found");
            ThrowError($"Office with id {command.Id} not found", 404);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new OfficeResponse
        {
            Id = command.Id,
            Name = office.Name,
            Description = office.Description,
            Company = new CompanyDTO
            {
                Id = office.Company.Id,
                Name = office.Company.Name,
            }
        };
    }
}
