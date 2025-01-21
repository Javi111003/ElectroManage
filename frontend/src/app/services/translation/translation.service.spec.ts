import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslationService } from './translation.service';
import { MSSG_ES_URL } from '../../config/api.config';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  const mockTranslations = {
    'Hello {1}': 'Hola {1}',
    'Welcome': 'Bienvenido',
    'Error {1} in line {2}': 'Error {1} en la línea {2}'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslationService]
    });
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Translation Operations', () => {
    beforeEach(async () => {
      service.loadTranslations();
      const req = httpMock.expectOne(MSSG_ES_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockTranslations);
    });
    
    it('should translate simple message', () => {
      const translated = service.translate('Welcome');
      expect(translated).toBe('Bienvenido');
    });

    it('should translate message with multiple parameters', () => {
      const translated = service.translate('Error 404 in line 50');
      expect(translated).toBe('Error 404 en la línea 50');
    });

    it('should return original message when no translation found', () => {
      const originalMessage = 'No translation for this';
      const translated = service.translate(originalMessage);
      expect(translated).toBe(originalMessage);
    });

    it('should handle empty message', () => {
      const emptyMessage = '';
      const translated = service.translate(emptyMessage);
      expect(translated).toBe(emptyMessage);
    });

    it('should handle null or undefined messages', () => {
      const nullMessage = null as unknown as string;
      const undefinedMessage = undefined as unknown as string;
      
      expect(service.translate(nullMessage)).toBe(nullMessage);
      expect(service.translate(undefinedMessage)).toBe(undefinedMessage);
    });
  });

  describe('Translation Pattern Matching', () => {
    beforeEach(async () => {
      service.loadTranslations();
      const req = httpMock.expectOne(MSSG_ES_URL);
      req.flush(mockTranslations);
    });

    it('should match exact patterns', () => {
      const message = 'Hello 123';
      const translated = service.translate(message);
      expect(translated).toBe('Hola 123');
    });

    it('should handle multiple numeric parameters', () => {
      const message = 'Error 500 in line 100';
      const translated = service.translate(message);
      expect(translated).toBe('Error 500 en la línea 100');
    });
  });
});
