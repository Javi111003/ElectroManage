﻿namespace ElectroManage.Application.DTO_s;
public record AdministrativeAreaDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
}