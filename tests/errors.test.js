const request = require('supertest');
const app = require('../server.js');

jest.mock('axios');

it('should return a clear error message on API failure', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error logs
    axios.post.mockRejectedValue(new Error('Mocked API Error'));

    const response = await request(app).post('/api/chat').send({ prompt: 'Force error' });
    expect(response.statusCode).toBe(500);
    expect(response.text).toContain('Error communicating with OpenAI');
});

describe('Error Handling Tests', () => {
    it('should return 404 for unknown routes', async () => {
        const response = await request(app).get('/api/unknown');
        expect(response.statusCode).toBe(404);
    });

    it('should return a clear error message on API failure', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error in test logs
        const response = await request(app).post('/api/chat').send({ prompt: 'Force error' });
        expect(response.statusCode).toBe(500);
        expect(response.text).toContain('Error communicating with OpenAI');
    });
});
