const request = require('supertest');
const app = require('../server.js');

describe('Chat API Tests', () => {
    it('should return a valid response from OpenAI', async () => {
        const response = await request(app).post('/api/chat').send({ prompt: 'Hello!' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('reply');
    });

    it('should include mood in the response', async () => {
        const response = await request(app).post('/api/chat').send({ prompt: 'Hello!' });
        expect(response.body).toHaveProperty('mood');
        expect(response.body.mood).toBe('gentil'); // Assuming the default mood is gentil
    });

    it('should handle empty prompts gracefully', async () => {
        const response = await request(app).post('/api/chat').send({ prompt: '' });
        expect(response.statusCode).toBe(500); // Or appropriate error handling
        expect(response.text).toContain('Error communicating with OpenAI');
    });
});
