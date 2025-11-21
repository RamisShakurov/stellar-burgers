describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait(['@getIngredients']);
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
