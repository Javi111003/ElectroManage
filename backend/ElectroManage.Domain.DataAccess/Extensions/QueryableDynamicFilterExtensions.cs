using ElectroManage.Common.Dtos;
using System.Linq.Dynamic.Core;


namespace ElectroManage.Domain.DataAccess.Extensions;
public static class QueryableDynamicFilterExtensions
{
    private static readonly IDictionary<string, string>
        _operators = new Dictionary<string, string>
        {
        { "eq", "=" },
        { "neq", "!=" },
        { "lt", "<" },
        { "lte", "<=" },
        { "gt", ">" },
        { "gte", ">=" },
        { "like", "Contains" },
        };

    public static IQueryable<T> ToDynamic<T>(
            this IQueryable<T> queryable,
            IEnumerable<FilterRequest>? filters = null,
            IEnumerable<SortRequest>? sorts = null)
    {
        if (filters is not null && filters.Count() > 0)
        {
            queryable = Filter(queryable, filters);
        }
        if (sorts is not null && sorts.Count() > 0)
        {
            queryable = Sort(queryable, sorts);
        }

        return queryable;
    }

    private static IQueryable<T> Filter<T>(IQueryable<T> queryable, IEnumerable<FilterRequest> filters)
    {
        string[] values = filters.Select(x => x.Op == "like" ? x.Value.ToLower() : x.Value).ToArray();
        string where = Transform(filters);
        return queryable.Where(where, values);
    }

    private static string Transform(IEnumerable<FilterRequest> filters)
    {
        var index = 0;
        var where = new List<string>();

        foreach (var filter in filters)
        {
            if (string.IsNullOrEmpty(filter.Field)) throw new ArgumentException("Invalid Field");
            if (string.IsNullOrEmpty(filter.Op) || !_operators.ContainsKey(filter.Op)) throw new ArgumentException("Invalid Operator");

            string op = _operators[filter.Op];

            if (!string.IsNullOrEmpty(filter.Value))
            {
                if (op == "Contains")
                {
                    where.Add($"(np({filter.Field}).ToLower().{op}(@{index}))");
                }
                else
                {
                    where.Add($"np({filter.Field}) {op} @{index}");
                }
            }

            index++;
        }

        return string.Join(" and ", where);
    }

    private static IQueryable<T> Sort<T>(IQueryable<T> queryable, IEnumerable<SortRequest> sorts)
    {
        var sortsStr = new List<string>();
        foreach (var sort in sorts)
        {
            if (string.IsNullOrEmpty(sort.Field)) throw new ArgumentException("Invalid Field");

            sortsStr.Add($"{sort.Field} {(sort.IsAsc ? "asc" : "desc")}");
        }

        var ordering = string.Join(",", sortsStr);
        return queryable.OrderBy(ordering);
    }
}