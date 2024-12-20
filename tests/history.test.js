const request = require('supertest');
const app = require('../server.js');

describe('Chat History Tests', () => {
    it('should store chat history in cookies', async () => {
        const agent = request.agent(app);
        await agent.post('/api/chat').send({ prompt: 'Hello' });

        const response = await agent.post('/api/chat').send({ prompt: 'How are you?' });
        expect(response.body.reply).toBeDefined();
    });

    it('should reset history with /api/reset', async () => {
        const agent = request.agent(app);
        await agent.post('/api/chat').send({ prompt: 'Hello' });
        await agent.post('/api/reset');
        
        const response = await agent.post('/api/chat').send({ prompt: 'New prompt' });
        expect(response.body.reply).toBeDefined();
        expect(response.body.history).toBeUndefined(); // Assuming cookies were cleared
    });
});
