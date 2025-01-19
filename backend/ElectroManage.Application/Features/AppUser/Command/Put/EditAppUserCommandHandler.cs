using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using User = ElectroManage.Domain.Entites.Identity.AppUser;

namespace ElectroManage.Application.Features.AppUser.Command.Put;
internal class EditAppUserCommandHandler : CoreCommandHandler<EditAppUserCommand, EditAppUserResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditAppUserCommandHandler> _logger;
    readonly UserManager<User> _userManager;
    public EditAppUserCommandHandler(IUnitOfWork unitOfWork, ILogger<EditAppUserCommandHandler> logger, UserManager<User> userManager) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _userManager = userManager;
    }
    public override async Task<EditAppUserResponse> ExecuteAsync(EditAppUserCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepository = _unitOfWork.DbRepository<User>();
        var roleRepository = _unitOfWork.DbRepository<AppRole>();
        var allowedRoles = roleRepository.GetAll(useInactive: true).Select(r => r.Name).ToList();
        var user = await userRepository.FirstAsync(filters: u => u.Id == command.Id);
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
        if(!allowedRoles.Any( role => role!.Equals(command.Role, StringComparison.InvariantCultureIgnoreCase)))
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Role with name : {command.Role} not found");
            ThrowError($" Role with name : {command.Role} not found");
        }
        user.UserName = command.Username;
        user.CompanyId = command.CompanyId;
        user.Company = company;
        var roles = await _userManager.GetRolesAsync(user);
        var result = await _userManager.RemoveFromRolesAsync(user , roles);
        if (!result.Succeeded)
        {
            foreach(var error in result.Errors)
            {
                _logger.LogError($"{nameof(ExecuteAsync)} | Error removing role.\n \nError Message: {error.Description}");
                ThrowError($" Error removing role.\n \nError Message: {error.Description}");
            }
        }
        var addRoleResult = await _userManager.AddToRoleAsync(user ,command.Role);
        if (!addRoleResult.Succeeded)
        {
            foreach (var error in addRoleResult.Errors)
            {
                _logger.LogError($"{nameof(ExecuteAsync)} | Error adding role.\n \nError Message: {error.Description}");
                ThrowError($" Error adding role.\n \nError Message: {error.Description}");
            }
        }
        await userRepository.UpdateAsync(user, false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new EditAppUserResponse
        {
            Id = user.Id,
            Username = user.UserName,
            Company = new DTO_s.CompanyDTO
            {
                Id = company.Id,
                Name = company.Name,
            },
            Role = command.Role
        };
    }
}