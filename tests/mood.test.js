const request = require('supertest');
const app = require('../server.js');

describe('Mood API Tests', () => {
    it('should set mood to gentil', async () => {
        const response = await request(app).post('/api/mood').send({ mood: 'gentil' });
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Humeur changée à : gentil');
    });

    it('should set mood to hautain', async () => {
        const response = await request(app).post('/api/mood').send({ mood: 'hautain' });
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Humeur changée à : hautain');
    });

    it('should return an error for invalid mood', async () => {
        const response = await request(app).post('/api/mood').send({ mood: 'invalid' });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('Humeur invalide.');
    });
});
