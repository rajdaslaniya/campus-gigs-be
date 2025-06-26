import { Injectable } from '@nestjs/common';

// import GoogleGenerativeAI from 'googlegenerativeai';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async generateAnswer(question: string): Promise<string> {
    // Replace 'gemini-pro' with your model if needed
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(question);
    const response = await result.response;
    return response.text();
  }
}
