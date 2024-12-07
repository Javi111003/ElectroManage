﻿using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Location.Command.Post;

public record CreateLocationResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long ZipCode { get; set; }
    public string Description { get; set; } = string.Empty;
    public CoordenateDTO Coordenate { get; set; } = null!;
    public AddressDTO Address { get; set; } = null!;
}