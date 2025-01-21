using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class CostFormulaMapper
{
    public static CostFormulaDTO MapToCostFormulaDTO(Domain.Entites.Sucursal.CostFormula costFormula)
    {
        return new CostFormulaDTO {
            Id = costFormula.Id,
            Name = costFormula.Name,
            Expression = costFormula.Expression,
            Variables = costFormula.VariableDefinitions.Select(v => new VariableDefinitionDto
            {
                VariableName = v.Name,
                Expression = v.Expression
            }).ToList(),
        };
    }
}