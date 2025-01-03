﻿namespace ElectroManage.Application.Features.Administrative_Area.Command.Put;

public record EditAdministrativeAreaResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}