const request = require('supertest');
const app = require('../server.js'); // Adjust the path if needed

describe('Mood Route Tests', () => {
    it('Should set mood to gentil', async () => {
        const response = await request(app).post('/api/mood').send({ mood: 'gentil' });
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Humeur changée à : gentil');
    });

    it('Should return error for invalid mood', async () => {
        const response = await request(app).post('/api/mood').send({ mood: 'invalid' });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('Humeur invalide.');
    });
});
