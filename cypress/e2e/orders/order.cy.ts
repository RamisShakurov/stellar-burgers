describe('Должен создать заказ', () => {
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

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Space burger',
        order: { number: 12345 }
      }
    }).as('createOrder');

    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser', '@getOrders']);
  })
  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Должен создавать заказ', () => {
    cy.get('[data-cy="ingredient-bun"]')
      .first()
      .find('button')
      .click();

    cy.get('[data-cy="constructor-bun-top-element"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom-element"]').should('exist');
    cy.get('[data-cy="constructor-button-create-order"]').click();
    cy.wait('@createOrder');
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal"]').should('contain.text', '12345');
    cy.get('[data-cy="close-button"]').last().click();
    cy.get('[data-cy="modal"]').should('not.exist')
    cy.get('[data-cy="constructor-bun-top-element"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom-element"]').should('not.exist');
  });
});
