using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace ElectroManage.Application.Features.AppUser.Command.Put;

internal class EditUserCommandHandler : CoreCommandHandler<EditAppUserCommand, EditAppUserResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditUserCommandHandler> _logger;

    public EditUserCommandHandler(IUnitOfWork unitOfWork, ILogger<EditUserCommandHandler> logger=)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<EditAppUserResponse> ExecuteAsync(EditAppUserCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepository = _unitOfWork.DbRepository<Domain.Entites.Identity.AppUser>();
        var user = await userRepository.GetAll(filters: u => u.Id == command.Id).FirstAsync();
        if (user == null)
        {
            _logger.LogError($"User with id {command.Id} not found");
            ThrowError($"User with id {command.Id} not found", 404);
        }
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var company = await companyRepository.FirstAsync(filters: c => c.Id == command.CompanyId);
        if (company == null)
        {
            _logger.LogError($"Company with id {command.CompanyId} not found");
            ThrowError($"Company with id {command.CompanyId} not found", 404);
        }
        user.UserName = command.NickName;
        user.CompanyId = command.CompanyId;
        user.Company = company;
        await userRepository.SaveAsync(user);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new EditAppUserResponse
        {
            Id = user.Id,
            UserName = user.UserName,
            Company = new DTO_s.CompanyDTO
            {
                Id = company.Id,
                Name = company.Name,
            }
        };
    }
}
