import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import elements from "../../locators";
import patientData from '../../../fixtures/patientData.json';
import serviceData from '../../../fixtures/serviceData.json';

Given("I open the mediverse login page and log in as {string} with valid credentials", (user) => {
    const emailMap = {
        Perawat: Cypress.env('PERAWAT_EMAIL'),
        Dokter: Cypress.env('DOKTER_EMAIL'),
        Operator: Cypress.env('OPERATOR_EMAIL'),
      };
      
      const email = emailMap[user];
      
      if (email) {
        cy.Login(email, Cypress.env('PASSWORD'));
      } else {
        throw new Error(`Unknown user type: ${user}`);
      }
      

});

When("I navigate to the {string} page and select {string}", (Menu, Submenu) => {
    cy.clickSidebarMenu(Menu, Submenu);   
});

When("I select one of the {string} patients in the queue", (service) => {
    cy.readFile('cypress/fixtures/queueCode.json').then((data) => {
      // Define the queue codes for each service
      const queueCodes = {
        Imunisasi: data.Imunisasiqueue,
        Laboratorium: data.Laboratoriumqueue,
        "Rawat Jalan": data.Klinikqueue,
      };

      const queueCode = queueCodes[service]; // Get the correct queue code based on the service
      cy.get('input[name="search"]').type(queueCode, { force: true });

      // Wait for the table to load and check for "Data tidak di temukan" message
      cy.contains("table", "Data tidak di temukan").then(($msg) => {
        // If "Data tidak di temukan" is found, trigger the registration scenario
        if ($msg.length > 0) {
          cy.log(
            `Queue code not found for Rawat Jalan. Running registration scenario.`
          );

          // Directly run the @registrasi_rawat_jalan_umum scenario
          cy.exec(
            `npx cypress run --spec cypress/e2e/RME/feature/registrasi.feature --env TAGS="@regis_rawat_jalan_umum"`,
            { failOnNonZeroExit: false }
          ).then((result) => {
            cy.log("Exec result:", result);
            if (result.code !== 0) {
              cy.log("Error during exec:", result.stderr);
            }
          });
        } else {
          // If queue code is found in the table, proceed with normal flow
          cy.get("table tbody tr").contains(queueCode).should("exist");
          cy.get(".w-56 > ._button__primary_17c3w_37").click();
        }
      });
    });
});

  

