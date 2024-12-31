using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Command.Delete;

public class DeleteCompanyCommandHandler : CoreCommandHandler<DeleteCompanyCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteCompanyCommandHandler> _logger;

    public DeleteCompanyCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteCompanyCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var company = await companyRepository.FirstAsync(useInactive: false, filters: x => x.Id == command.Id);
        if (company is null)
        {
            _logger.LogError($"Company with id {command.Id} not found");
            ThrowError($"Company with id {command.Id} not found", 404);
        }
        company.StatusBaseEntity = Domain.Enums.StatusEntityType.Inactive;
        await companyRepository.UpdateAsync(company);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
