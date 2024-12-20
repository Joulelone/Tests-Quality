const request = require('supertest');
const app = require('../server.js');

describe('Reset API Tests', () => {
    it('should reset history and mood cookies', async () => {
        const response = await request(app).post('/api/reset');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Historique et humeur réinitialisés.');
    });

    it('should clear cookies after reset', async () => {
        const agent = request.agent(app); // Use an agent to persist cookies
        await agent.post('/api/mood').send({ mood: 'hautain' }); // Set mood
        const resetResponse = await agent.post('/api/reset');
        expect(resetResponse.statusCode).toBe(200);
    
        // Test if cookies were cleared
        const chatResponse = await agent.post('/api/chat').send({ prompt: 'Test' });
        expect(chatResponse.body.mood).toBeUndefined();
    });
});
