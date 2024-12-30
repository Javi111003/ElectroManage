export interface Equipment {
  id: number;
  officeId: number;
  companyId: number;
  name: string;
  useFrequency: string;
  maintenanceStatus: string;
  model: string;
  efficiency: number;
  brand: string;
  equipmentType: string;
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
