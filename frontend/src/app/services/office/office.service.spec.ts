import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OfficeService } from './office.service';
import { API_URL } from '../../config/api.config';
import { Office, OfficeInfo } from '../../models/office.interface';
import { Equipment, EquipmentBrand, EquipmentInstance, EquipmentSpecification, EquipmentType, EquipPropertyInfo, EquipSpecificationInfo, EquipmentSpecificationEdited } from '../../models/equipment.interface';

describe('OfficeService', () => {
  let service: OfficeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OfficeService]
    });
    service = TestBed.inject(OfficeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Office Operations', () => {
    const mockOffice: Office = {
      companyId: 1,
      name: 'Test Office',
      description: 'Test Description'
    };

    const mockOfficeInfo: OfficeInfo = {
      id: 1,
      name: 'Test Office',
      description: 'Test Description',
      company: { id: 1, name: 'Test Company' }
    };

    it('should get office list', () => {
      const centerID = 1;
      const mockOffices: OfficeInfo[] = [mockOfficeInfo];

      service.getOfficeList(centerID).subscribe(offices => {
        expect(offices).toEqual(mockOffices);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/company/${centerID}/office`);
      expect(req.request.method).toBe('GET');
      req.flush(mockOffices);
    });

    it('should post new office', () => {
      service.postOffice(mockOffice).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/office`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockOffice);
      req.flush({});
    });

    it('should edit office', () => {
      const officeId = 1;
      service.editOffice(mockOffice, officeId).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/office/${officeId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockOffice);
      req.flush({});
    });

    it('should delete office', () => {
      const officeId = 1;
      service.deleteOffice(officeId).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/office/${officeId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Equipment Operations', () => {
    const mockEquipment: Equipment = {
      id: 1,
      instalationDate: '2023-01-01',
      useFrequency: 'DAILY',
      maintenanceStatus: 'GOOD',
      equipmentSpecification: {
        id: 1,
        model: 'Test Model',
        capacity: 100,
        criticalEnergySystem: false,
        averageConsumption: 50,
        lifeSpanYears: 5,
        efficiency: 0.8,
        equipmentBrand: { id: 1, name: 'Test Brand', description: null },
        equipmentType: { id: 1, name: 'Test Type', description: null }
      },
      office: {
        id: 1,
        name: 'Test Office',
        description: null,
        company: { id: 1, name: 'Test Company' }
      }
    };

    const mockEquipmentInstance: EquipmentInstance = {
      instalationDate: '2023-01-01',
      maintenanceStatus: 'GOOD',
      useFrequency: 'DAILY',
      equipmentSpecificationId: 1,
      officeId: 1
    };

    it('should get equipment list', () => {
      const officeId = 1;
      service.getEquipmentList(officeId).subscribe(equipment => {
        expect(equipment).toEqual([mockEquipment]);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/office/${officeId}/list_equipment`);
      expect(req.request.method).toBe('GET');
      req.flush([mockEquipment]);
    });

    it('should post equipment instance', () => {
      service.postEquipmentInstance(mockEquipmentInstance).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/equipment`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockEquipmentInstance);
      req.flush({});
    });

    it('should delete equipment instance', () => {
      const equipmentId = 1;
      service.deleteEquipmentInstance(equipmentId).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/equipment/${equipmentId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should edit equipment instance', () => {
      const equipmentId = 1;
      service.editEquipmentInstance(mockEquipmentInstance, equipmentId).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/equipment/${equipmentId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockEquipmentInstance);
      req.flush({});
    });
  });

  describe('Equipment Configuration Operations', () => {
    const mockBrand: EquipmentBrand = {
      name: 'Test Brand',
      description: 'Test Description'
    };

    const mockType: EquipmentType = {
      name: 'Test Type',
      description: 'Test Description'
    };

    const mockSpecification: EquipmentSpecification = {
      model: 'Test Model',
      capacity: 100,
      criticalEnergySystem: false,
      averageConsumption: 50,
      lifeSpanYears: 5,
      efficiency: 0.8,
      equipmentBrandId: 1,
      equipmentTypeId: 1
    };

    it('should get equipment type list', () => {
      const mockTypes: EquipPropertyInfo[] = [{ id: 1, name: 'Test Type', description: null }];
      
      service.getEquipmentTypeList().subscribe(types => {
        expect(types).toEqual(mockTypes);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/equipment_type`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTypes);
    });

    it('should get equipment brand list', () => {
      const mockBrands: EquipPropertyInfo[] = [{ id: 1, name: 'Test Brand', description: null }];
      
      service.getEquipmentBrandList().subscribe(brands => {
        expect(brands).toEqual(mockBrands);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/equipment_brand`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBrands);
    });

    it('should post equipment brand', () => {
      service.postEquipmentBrand(mockBrand).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/equipment_brand`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBrand);
      req.flush({});
    });

    it('should post equipment type', () => {
      service.postEquipmentType(mockType).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/equipment_type`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockType);
      req.flush({});
    });

    it('should post equipment specification', () => {
      service.postEquipmentSpecification(mockSpecification).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/equipment_specification`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockSpecification);
      req.flush({});
    });
  });
});
