import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MSSG_ES_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private http: HttpClient) {}

  private translations: any = {};

  /**
   * Asynchronously loads translations from a specified URL and stores them in the service.
   */
  async loadTranslations() {
    const translations = await this.http.get(MSSG_ES_URL).toPromise();
    this.translations = translations;
  }

  /**
   * Translates a given message using the loaded translations.
   * If a translation is not found, the original message is returned.
   *
   * @param message - The message to be translated.
   * @returns The translated message or the original message if no translation is found.
   */
  translate(message: string): string {
    const key = this.findKey(message);
    if (!key) {
      return message;
    }

    let translation = this.translations[key] || message;

    const regex = new RegExp(key.replace(/{\w+}/g, '(\\d+)'));
    const values = message.match(regex);

    if (values) {
      values.slice(1).forEach((value, index) => {
        translation = translation.replace(`{${Object.keys(values)[index + 1]}}`, value);
      });
    }

    return translation;
  }

  /**
   * Finds the key in the translations that matches the given message.
   *
   * @param message - The message to find the key for.
   * @returns The key if found, otherwise undefined.
   */
  private findKey(message: string): string | undefined {
    return Object.keys(this.translations).find(key => {
      const regex = new RegExp('^' + key.replace(/{\w+}/g, '.+') + '$');
      return regex.test(message);
    });
  }
}
