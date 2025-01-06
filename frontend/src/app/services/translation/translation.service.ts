import { Injectable } from '@angular/core';
import axios from 'axios';
import { translate_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  async translate(text: string, targetLanguage: string): Promise<string> {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLanguage,
        format: "text",
        alternatives: 3,
        api_key: ""
      }),
      headers: { "Content-Type": "application/json" }
    });

    const data: any = await res.json();
    return data.translatedText;
  }
}
