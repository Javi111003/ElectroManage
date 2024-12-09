using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.CostFormula.Command.Delete;

public class DeleteCostFormulaCommandHandler : CoreCommandHandler<DeleteCostFormulaCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteCostFormulaCommandHandler> _logger;

    public DeleteCostFormulaCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteCostFormulaCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<Response<NoContentData>> ExecuteAsync(DeleteCostFormulaCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var costFormulaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.CostFormula>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.CostFormula, bool>>[]
        {
            x => x.Id == command.Id,
        };

        var costFormula = await costFormulaRepository.FirstAsync(useInactive: true, filters: filter);
        if (costFormula is null)
        {
            _logger.LogError($"The cost formula with id {command.Id} doesn't exist");
            ThrowError($"The cost formula with id {command.Id} doesn't exist", 404);
        }
        var company = await companyRepository.FirstAsync(useInactive: true, filters: c => c.Id == costFormula.CompanyId);
        if (company is null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id {costFormula.CompanyId} does not exists");
            ThrowError("Company with id {command.CompanyId} does not exists", 404);
        }
        costFormula.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        company.CostFormulas.Remove(costFormula);
        await companyRepository.UpdateAsync(company, false);
        await costFormulaRepository.UpdateAsync(costFormula, false);
        await UnitOfWork!.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}