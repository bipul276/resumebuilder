import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';

// Explicitly load .env from server directory
const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

async function testGemini() {
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log('API Key present:', !!apiKey);
    console.log('API Key length:', apiKey?.length);

    if (!apiKey) {
        console.error('ERROR: GOOGLE_API_KEY not found in environment variables');
        process.exit(1);
    }

    try {
        console.log('Listing available models via raw fetch...');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('List Models Failed:', response.status, response.statusText);
            console.error('Response:', errorText);
            throw new Error(`Failed to list models: ${response.status}`);
        }

        const data = await response.json();
        console.log('Available Model Names:', data.models.map((m: any) => m.name));

        // Try to pick a valid model
        const validModel = data.models.find((m: any) => m.name.includes('gemini-1.5-flash')) || data.models[0];
        const modelName = validModel ? validModel.name.replace('models/', '') : 'gemini-pro';

        console.log(`\nAttempting generation with: ${modelName}`);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log('Sending test prompt...');
        const prompt = 'Hello, reply with "API Working" if you can read this.';
        const result = await model.generateContent(prompt);
        const responseGen = await result.response;
        const text = responseGen.text();

        console.log('SUCCESS: API Response:', text);
    } catch (error: any) {
        console.error('FAILURE: API Test Failed');
        console.error('Error message:', error.message);
        if (error.response) {
            console.error('Error status:', error.response.status);
        }
    }
}

testGemini();
