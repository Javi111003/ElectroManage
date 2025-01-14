import { OfficeInfo } from "./office.interface";

// Equipment instance data to be listed
export interface Equipment {
  id: number;
  instalationDate: string;
  useFrequency: string;
  maintenanceStatus: string;
  equipmentSpecification: EquipSpecificationInfo;
  office: OfficeInfo;
}

// Equipment brand info to POST
export interface EquipmentBrand {
  name: string;
  description: string | null;
}

// Equipment type info to POST
export interface EquipmentType {
  name: string;
  description: string | null;
}

// Equipment Specification info for POST
export interface EquipmentSpecification {
  model: string;
  capacity: number;
  criticalEnergySystem: boolean;
  averageConsumption: number;
  lifeSpanYears: number;
  efficiency: number;
  equipmentBrandId: number;
  equipmentTypeId: number;
}

// Equipment Specification info for PUT
export interface EquipmentSpecificationEdited {
  id: number;
  model: string;
  capacity: number;
  criticalEnergySystem: boolean;
  averageConsumption: number;
  lifeSpanYears: number;
  efficiency: number;
  equipmentBrandId: number;
  equipmentTypeId: number;
}

// Equipment Specification info to be listed
export interface EquipSpecificationInfo {
  id: number;
  model: string;
  capacity: number;
  criticalEnergySystem: boolean;
  averageConsumption: number;
  lifeSpanYears: number;
  efficiency: number;
  equipmentBrand: EquipPropertyInfo;
  equipmentType: EquipPropertyInfo;
}

// Equipment instance for POST and PUT
export interface EquipmentInstance {
  instalationDate: string;
  maintenanceStatus: string;
  useFrequency: string;
  equipmentSpecificationId: number;
  officeId: number;
}

// Info of equipment types and brands to be listed
export interface EquipPropertyInfo {
  id: number;
  name: string;
  description: string | null;
}
