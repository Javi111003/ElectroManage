import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { Equipment } from '../../models/equipment.interface';
import { WorkCenter } from '../../models/workCenter.interface';
import { Office } from '../../models/office.interface';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getData and setData', () => {
    it('should set and get equipment data correctly', () => {
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
          equipmentBrand: {
            id: 1,
            name: 'Test Brand',
            description: null
          },
          equipmentType: {
            id: 1,
            name: 'Test Type',
            description: null
          }
        },
        office: {
          id: 1,
          name: 'Test Office',
          description: null,
          company: {
            id: 1,
            name: 'Test Company'
          }
        }
      };

      service.setData(mockEquipment);
      expect(service.getData()).toEqual(mockEquipment);
    });

    it('should set and get work center data correctly', () => {
      const mockWorkCenter: WorkCenter = {
        id: 1,
        name: 'Test Work Center'
      };

      service.setData(mockWorkCenter);
      expect(service.getData()).toEqual(mockWorkCenter);
    });

    it('should set and get office data correctly', () => {
      const mockOffice: Office = {
        companyId: 1,
        name: 'Test Office',
        description: null
      };

      service.setData(mockOffice);
      expect(service.getData()).toEqual(mockOffice);
    });
  });

  describe('currentData observable', () => {
    it('should emit new data when setData is called', (done) => {
      const testData = { test: 'value' };

      service.currentData.subscribe(data => {
        if (data.test) {
          expect(data).toEqual(testData);
          done();
        }
      });

      service.setData(testData);
    });
  });

  describe('dataUpdated observable', () => {
    it('should emit when notifyDataUpdated is called', (done) => {
      service.dataUpdated$.subscribe(() => {
        expect(true).toBeTruthy();
        done();
      });

      service.notifyDataUpdated();
    });
  });
});
