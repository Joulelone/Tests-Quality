const request = require('supertest');
const app = require('../server.js');

describe('Chat Route Tests', () => {
    it('Should return a response from ChatGPT', async () => {
        const response = await request(app).post('/api/chat').send({ prompt: 'Hello!' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('reply');
    });

    it('Should handle errors from OpenAI API', async () => {
        const response = await request(app).post('/api/chat').send({ prompt: '' });
        expect(response.statusCode).toBe(500); // Assuming the prompt being empty returns an error
    });
});
