describe('Controle Financeiro', () => { // serve para um conjunto de teste
  it('verifica o titulo da aplicação', () => {  // serve para um caso de teste
    cy.visit('http://localhost:5173/')
    cy.url().should('include', 'localhost:5173/dash')
    cy.title().should('be.equal', "Finance QA")
    cy.get('[data-cy="login-email"]').type('admin@finance.app')
    cy.get('[data-cy="login-password"]').type('123456')
    cy.get('[data-cy="login-button"]').click()
    cy.get('.btn').should('have.class', 'btn')

    cy.get('[data-cy="btn-new-transaction"]').click()
    cy.get('[data-cy="input-nome"]').should('not.exist')
    // cy.get('[data-cy="input-valor"]').type('100')
    // cy.get('select').select('Renda')
    // cy.get('[data-cy="checkbox-mensal"]').check()
    // cy.get('[data-cy="checkbox-mensal"]').uncheck()

  })
})