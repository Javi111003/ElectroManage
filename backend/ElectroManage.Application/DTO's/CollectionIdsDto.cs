namespace ElectroManage.Application.DTO_s;
public record CollectionIdsDto
{
    public IEnumerable<long> Ids { get; set; } = new HashSet<long>();  
}