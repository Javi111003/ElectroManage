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
