namespace ElectroManage.Common.Dtos;

public class QueryRequest
{
    public int? Page { get; set; } = 1;
    public int? PerPage { get; set; } = 10;
    public string? Query { get; set; }
    public IEnumerable<SortRequest>? Sorts { get; set; } = new List<SortRequest>();
    public IEnumerable<FilterRequest>? Filters { get; set; } = new List<FilterRequest>();
}