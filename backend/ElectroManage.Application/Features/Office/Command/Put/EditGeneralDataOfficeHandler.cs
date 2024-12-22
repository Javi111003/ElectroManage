using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Office.Command.Put;

public class EditGeneralDataOfficeHandler : CoreCommandHandler<EditGeneralDataOfficeCommand, OfficeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditGeneralDataOfficeHandler> _logger;

    public EditGeneralDataOfficeHandler(IUnitOfWork unitOfWork, ILogger<EditGeneralDataOfficeHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<OfficeResponse> ExecuteAsync(EditGeneralDataOfficeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();
        var officeInclude = new List<Expression<Func<Domain.Entites.Offices.Office, object>>>
        {
            x => x.Company,
            x => x.Company.Offices
        };
        var office = await officeRepository.FirstAsync(useInactive: true, includes: officeInclude, filters: x => x.Id == command.Id);
        if (office is null)
        {
            _logger.LogError($"Office with id {command.Id} not found");
            ThrowError($"Office with id {command.Id} not found", 404);
        }
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var company = await companyRepository.FirstAsync(useInactive: true, filters: x=> x.Id == command.CompanyId);
        if (company is null)
        {
            _logger.LogError($"Company with id {command.Id} not found");
            ThrowError($"Company with id {command.Id} not found", 404);
        }

        office.Name = command.Name;
        office.Description = command.Description;
        if (office.Company.Id != company.Id)
        {
            office.CompanyId = company.Id;
            office.Company = company;
            office.Company.Offices.Remove(office);
            company.Offices.Add(office);
        }
        await officeRepository.UpdateAsync(office, false);
        await companyRepository.UpdateAsync(company, false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");

        return Mappers.OfficeMapper.ToResponse(office);
    }
}
