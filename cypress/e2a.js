describe('Chat Application', () => {
    it('Simulates user interaction', () => {
        cy.visit('http://localhost:3000'); // Replace with your server URL
        cy.get('#prompt').type('Hi, how are you?');
        cy.contains('Envoyer').click();
        cy.get('#chat').should('contain', 'Vous: Hi, how are you?');
        cy.get('#chat').should('contain', 'GPT:'); // Check bot response exists
    });
});
