import { OfficeInfo } from "./office.interface";

export interface Equipment {
  id: number;
  instalationDate: string;
  useFrequency: string;
  maintenanceStatus: string;
  equipmentSpecification: EquipSpecificationInfo;
  office: OfficeInfo;
}

export interface EquipmentBrand {
  name: string;
  description: string | null;
}

export interface EquipmentType {
  name: string;
  description: string | null;
}

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

export interface EquipmentInstance {
  instalationDate: string;
  maintenanceStatus: string;
  useFrequency: string;
  equipmentSpecificationId: number;
  officeId: number;
}

export interface EquipPropertyInfo {
  id: number;
  name: string;
  description: string | null;
}
