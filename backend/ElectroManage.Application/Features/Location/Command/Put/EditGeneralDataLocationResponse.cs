﻿using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Location.Command.Put;

public record EditGeneralDataLocationResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public long ZipCode { get; set; }
    public AddressDTO? Address { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}