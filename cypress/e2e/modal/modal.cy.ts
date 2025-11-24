describe('Тестирование модальных окон', () => {
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

  it('Должен открывать модальное окно ингредиента и отображать правильный ингредиент', () => {
    cy.get('[data-cy="ingredient-bun"]').first().as('clickedIngredient');

    cy.get('@clickedIngredient')
      .find('[class*="text_type_main"]')
      .invoke('text')
      .as('ingredientName');

    cy.get('@clickedIngredient').click();

    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('@ingredientName').then((name) => {
      cy.get('[data-cy="modal"]').should('contain.text', name);
    });
  });

  it('Должен закрывать модальное окно ингредиента при клике на кнопку закрытия', () => {
    cy.get('[data-cy="ingredient-bun"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Должен закрывать модальное окно ингредиента при клике на оверлей', () => {
    cy.get('[data-cy="ingredient-bun"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
