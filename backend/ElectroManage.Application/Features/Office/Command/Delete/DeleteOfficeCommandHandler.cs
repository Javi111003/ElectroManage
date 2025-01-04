using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
namespace ElectroManage.Application.Features.Office.Command.Delete;

public class DeleteOfficeCommandHandler : CoreCommandHandler<DeleteOfficeCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteOfficeCommandHandler> _logger;

    public DeleteOfficeCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteOfficeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteOfficeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Offices
        };
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();
        var office = await officeRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if (office is null)
        {
            _logger.LogError($"Office with id {command.Id} not found");
            ThrowError($"Office with id {command.Id} not found", 404);
        }
        var company = await companyRepository.FirstAsync(filters: x => x.Id == office.CompanyId, includes: include);
        company.Offices.Remove(office);
        office.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await companyRepository.UpdateAsync(company, false);   
        await officeRepository.UpdateAsync(office, false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}