using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Administrative_Area.Query.Get;

public record ListAdministrativeAreaQuery : ICommand<IEnumerable<AdministrativeAreaDTO>>{ }