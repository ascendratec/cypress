describe('Upload de Arquivos', () => {
    beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:5173/')
    cy.get('[data-cy="login-email"]').type('admin@finance.app')
    cy.get('[data-cy="login-password"]').type('123456')
    cy.get('[data-cy="login-button"]').click() 
})

    it('Deve fazer upload de um arquivo com sucesso', () => {
    cy.get('[data-cy="btn-new-transaction"]').click();

    cy.get(':nth-child(7) > .w-full').click().selectFile('cypress/fixtures/example.json');

    cy.contains('Arquivo atual: example.json').should('be.visible');
    })
})