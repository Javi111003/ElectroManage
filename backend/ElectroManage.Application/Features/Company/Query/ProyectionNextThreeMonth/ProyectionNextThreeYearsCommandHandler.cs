using ElectroManage.Application.Abstractions;
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.ProyectionNextThreeMonth;

public class ProyectionNextThreeYearsCommandHandler : CoreCommandHandler<ProyectionNextThreeMonthCommand, IEnumerable<ProyectionDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ProyectionNextThreeYearsCommandHandler> _logger;
    readonly IProyectionService _proyectionService;

    public ProyectionNextThreeYearsCommandHandler(IUnitOfWork unitOfWork, ILogger<ProyectionNextThreeYearsCommandHandler> logger, IProyectionService proyectionService)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _proyectionService = proyectionService;
    }

    public override async Task<IEnumerable<ProyectionDTO>> ExecuteAsync(ProyectionNextThreeMonthCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            c => c.Registers
        };
        var company = await companyRepository.FirstAsync(includes: include, filters: c => c.Id == command.Id);
        if (company is null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {command.Id} not found");
            ThrowError($"{nameof(ExecuteAsync)} | Company with id {command.Id} not found", 404);
        }
        var response = _proyectionService.CalculateProyectionsAsync(company);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return response.Result;
    }
}
