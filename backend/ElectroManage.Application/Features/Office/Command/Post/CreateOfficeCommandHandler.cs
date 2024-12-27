using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Application.DTO_s;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroManage.Application.Features.Office.Command.Post;

public class CreateOfficeCommandHandler : CoreCommandHandler<CreateOfficeCommand, OfficeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateOfficeCommandHandler> _logger;

    public CreateOfficeCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateOfficeCommandHandler> logger) : base(unitOfWork)    
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<OfficeResponse> ExecuteAsync(CreateOfficeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var officeRepository = _unitOfWork.DbRepository<Domain.Entites.Offices.Office>();
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var company = await companyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.CompanyId);
        if (company is null)
        {
            _logger.LogError($"Company with id: {command.CompanyId} not found");
            ThrowError($"Company with id: {command.CompanyId} not found", 404);
        }
        var office = new Domain.Entites.Offices.Office
        {
            Name = command.Name,
            Description = command.Description,
            CompanyId = company.Id,
            Company = company,
        };
        await officeRepository.SaveAsync(office, false);

        company.Offices.Add(office);
        await companyRepository.UpdateAsync(company, false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new OfficeResponse
        {
            Id = office.Id,
            Name = office.Name,
            Description = office.Description,
            Company = new CompanyDTO
            {
                Id = company.Id,
                Name = company.Name,
            }
        };
    }
}
