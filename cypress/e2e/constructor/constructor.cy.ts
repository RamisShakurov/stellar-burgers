describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('GET', '**/api/orders', { fixture: 'orders.json' }).as(
      'getOrders'
    );

    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser', '@getOrders']);
  });

  it('Должен добавлять булку в конструктор', () => {
    cy.get('[data-cy="ingredient-bun"]')
      .first()
      .find('button')
      .click();

    cy.get('[data-cy="constructor-bun-top-element"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom-element"]').should('exist');
  });
});
