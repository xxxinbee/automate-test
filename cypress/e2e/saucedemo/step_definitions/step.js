import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the SauceDemo login page", () => {
  cy.visit("https://www.saucedemo.com/");
});

When(
  "I enter the username {string} and password {string}",
  (username, password) => {
    cy.get("#user-name").type(username);
    cy.get("#password").type(password);
  }
);

When("I click the login button", () => {
  cy.get("#login-button").click();
});

Then("I should be redirected to the inventory page", () => {
  cy.url().should("include", "inventory");
  cy.get('[data-test="title"]').should("have.text", "Products");
});

Then("I should see an error message", () => {
  cy.get('[data-test="error"]').should(
    "contain",
    "Epic sadface: Username and password do not match any user in this service"
  );
});

Given("I am logged in as a valid user", () => {
  cy.visit("https://www.saucedemo.com/");
  cy.get("#user-name").type("standard_user");
  cy.get("#password").type("secret_sauce");
  cy.get("#login-button").click();
  cy.wait(1000);
});

When('I add a product to the cart', () => {
  cy.get('.inventory_item').first().within(() => {
    cy.get('.inventory_item_name').invoke('text').then(productName => {
      cy.wrap(productName).as('selectedProduct'); // save as alias for assertion
    });

    cy.get('button').then($btn => {
      if ($btn.text().includes('Remove')) {
        cy.wrap($btn).click();
        cy.wait(200);
      }
      cy.get('button').contains('Add to cart').click();
    });
  });
});

Then("The cart badge should show {int} item", (count) => {
  cy.get('.shopping_cart_badge').should('have.text', `${count}`);
});


Then('The cart should contain the product I added', function () {
  cy.get('.shopping_cart_link').click(); // Go to cart page

  cy.get('@selectedProduct').then((productName) => {
    cy.get('.cart_item').should('contain.text', productName);
  });
});



When("I open the cart page", () => {
  cy.get('.shopping_cart_link').click();
  cy.get('body').then($body => {
    if ($body.find('.cart_item').length === 0) {
      // Go back to inventory
      cy.get('[data-test="continue-shopping"]').click();

      // Add some product
      cy.get('.inventory_item').first().within(() => {
        cy.get('button').then($btn => {
          if ($btn.text().includes('Remove')) {
            cy.wrap($btn).click(); 
          }
          cy.get('button').contains('Add to cart').click();
        });
      });

      cy.get('.shopping_cart_link').click();

      // Make sure the cart is no longer empty
      cy.get('.cart_item').should('have.length.greaterThan', 0);

    } else {
      // Assert cart is already not empty
      cy.get('.cart_item').should('have.length.greaterThan', 0);
    }
  });
});

When("I click checkout button", () => {
  cy.get('[data-test="checkout"]').click();
});

When("I complete the order form with valid data", () => {
  cy.get('[data-test="firstName"]').type("Cloudy");
  cy.get('[data-test="lastName"]').type("Burn");
  cy.get('[data-test="postalCode"]').type("12345");
  cy.get('[data-test="continue"]').click();
});

When("I click finish button", () => {
  cy.get('[data-test="finish"]').click();
});


Then("I should see success checkout message", () => {
  cy.get('.complete-header').should('have.text', 'Thank you for your order!');
});

When("I don't complete the order form", () => {
  cy.get('[data-test="continue"]').click();
});

Then("I should error message", () => {
  cy.get('[data-test="error"]').should(
    "contain",
    "Error: First Name is required"
  );  
});