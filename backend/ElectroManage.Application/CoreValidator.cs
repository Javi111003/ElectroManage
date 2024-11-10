using FluentValidation;

namespace ElectroManage.Application;

public class CoreValidator<TCommand> : Validator<TCommand> where TCommand : class
{
    public CoreValidator()
    {
        RuleLevelCascadeMode = CascadeMode.Stop;
    }
}