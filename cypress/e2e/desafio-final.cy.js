describe("Deve realizar login e adicionar uma transação", () => {
  const baseUrl = "http://localhost:5173/";
  const email = "admin@finance.app";
  const password = "123456";
  const transactionName = `Salario Cypress`;
  const amount = "150.50";

  it("realizando login na aplicação", () => {
    cy.viewport(1280, 720);
    cy.visit(baseUrl);
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="total-balance"]').should("exist");
  });

  it("Verificando valores dos card Saldo, Receitas e Despesas", () => {
    cy.viewport(1280, 720);
    cy.visit(baseUrl);
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);
    cy.get('[data-cy="login-button"]').click();

    cy.get('[data-cy="total-balance"]').should("contain", "R$ 0,00");
    cy.get('[data-cy="total-income"]').should("contain", "R$ 0,00");
    cy.get('[data-cy="total-expense"]').should("contain", "R$ 0,00");
  });

  it("Adicionando uma nova transação", () => {
    cy.viewport(1280, 720);
    cy.visit(baseUrl);
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);
    cy.get('[data-cy="login-button"]').click();

    cy.get('[data-cy="btn-new-transaction"]').click();
    cy.get('[data-cy="transaction-modal"]').should("be.visible");
    cy.get('[data-cy="input-nome"]').type(transactionName);
    cy.get('[data-cy="input-valor"]').type(amount);
    cy.get("select").select("Renda");
    cy.get('input[name="tipo"][value="Depósito"]').check({ force: true });
    cy.get('[data-cy="checkbox-mensal"]').check({ force: true });
    cy.get('[data-cy="btn-submit-transaction"]').click();

    cy.get('[data-cy="toast"]')
      .should("be.visible")
      .and("contain", "adicionado");
  });

  it("Verifica se a transação foi adicionada na seção Últimas Transações", () => {
    cy.viewport(1280, 720);
    cy.visit(baseUrl);
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);
    cy.get('[data-cy="login-button"]').click();

    cy.get('[data-cy="btn-new-transaction"]').click();
    cy.get('[data-cy="input-nome"]').clear().type(transactionName);
    cy.get('[data-cy="input-valor"]').clear().type(amount);
    cy.get("select").select("Renda");
    cy.get('input[name="tipo"][value="Depósito"]').check({ force: true });
    cy.get('[data-cy="btn-submit-transaction"]').click();

    cy.contains("Últimas Transações").should("exist");
    cy.contains(transactionName).should("exist");
    cy.contains(`R$ ${parseFloat(amount).toFixed(2)}`).should("exist");
  });

  it("Verifica se a transação foi adicionada na tela de Transações", () => {
    cy.viewport(1280, 720);
    cy.visit(baseUrl);
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);
    cy.get('[data-cy="login-button"]').click();

    cy.get('[data-cy="btn-new-transaction"]').click();
    cy.get('[data-cy="input-nome"]').clear().type(transactionName);
    cy.get('[data-cy="input-valor"]').clear().type(amount);
    cy.get("select").select("Renda");
    cy.get('input[name="tipo"][value="Depósito"]').check({ force: true });
    cy.get('[data-cy="btn-submit-transaction"]').click();

    cy.get('[data-cy="nav-transactions"]').click();
    cy.get('[data-cy="transactions-list"]')
      .contains(transactionName)
      .should("exist");
  });
});
