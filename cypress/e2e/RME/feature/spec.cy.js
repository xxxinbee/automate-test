// cypress/e2e/spec.cy.js

describe('Halaman Login', () => {
    beforeEach(() => {
       
      cy.Login(Cypress.env('DOKTER_EMAIL'), Cypress.env('PASSWORD'))
    });
  
    it('search', () => {
      cy.viewport(1980, 1640);
     
     cy.visit('https://rme-staging.mediverse.id/transactions/clinic-outpatient-treatment/366')
     cy.scrollTo('bottom')
      // cy.get("#Registrasi p").click();
      // cy.get("#Menunggu\\ Tindakan p").click();
      // cy.get("tr:nth-of-type(1) div.items-start > div.flex p").click();


      //soap dokter
      cy.get('[class*="css-"][class*="-control"]').eq(0).click();
      cy.get('[id^="react-select-"][id$="-input"]').eq(0)
        .type('A00', { force: true })
        .then(() => {
          cy.get('[id^="react-select-"][id$="-listbox"]').eq(0)
            .contains('A00 - Cholera', { timeout: 10000 })
            .should("be.visible")
            .click();
        });  



      cy.get("body div:nth-of-type(5) > div > div:nth-of-type(1) > div:nth-of-type(1) input").click();
      cy.get("div:nth-of-type(5) > div > div:nth-of-type(1) > div:nth-of-type(2) input").click();
      cy.get("div:nth-of-type(5) > div > div:nth-of-type(1) > div:nth-of-type(3) input").click();
      cy.get("div:nth-of-type(5) div.col-span-2 > div:nth-of-type(1) input").click();
      cy.get("div.col-span-2 > div:nth-of-type(2) input").click();
      cy.get("div.col-span-2 > div:nth-of-type(3) > label").click();
      cy.get("div.py-6 div:nth-of-type(2) > button").click();
      cy.get("#modal-root h6").click();
      cy.get("#modal-root h6").click();
      cy.get("#modal-root div.flex-col > div.flex p").click();
      cy.get("#root > div > div:nth-of-type(2) button:nth-of-type(2) p").click();
      cy.get("div.py-6 > div > div.flex-col > div:nth-of-type(1) div.css-19bb58m").click();

      
        //dropdown tindakan icd 9
      cy.get('[class*="css-"][class*="-control"]').eq(0).click();
      cy.get('[id^="react-select-"][id$="-input"]').eq(0)
        .type('00', { force: true })
        .then(() => {
          cy.get('[id^="react-select-"][id$="-listbox"]').eq(0)
            .contains('00 - Procedures and interventions, Not Elsewhere Classified', { timeout: 10000 })
            .should("be.visible")
            .click();
        }); 


      cy.get("div.py-6 div.flex > div:nth-of-type(2) p").click();
      cy.get("#modal-root div.flex-col button").click();
      cy.get("button:nth-of-type(3) p").click();
      cy.get("#yes").click();
      cy.get("div.css-19bb58m").click();


      // resep

      let medicines = ["Antasida", "Guaifenesin", "Paracetamol"];

      medicines.forEach((medicine) => {
        cy.get('[class*="css-"][class*="-control"]').eq(0).click();
        cy.get('[id^="react-select-"][id$="-input"]')
          .eq(0)
          .type(medicine, { force: true })
          .then(() => {
            cy.get('[id^="react-select-"][id$="-listbox"]')
              .eq(0)
              .contains(medicine, { timeout: 10000 })
              .should("be.visible")
              .click();
          });
      
        cy.get("[data-testid='modal-test'] > div > div.flex").click();
        cy.get("#counter-input").clear().type(3);
        cy.get("div.flex-col > div:nth-of-type(3) input").click();
        cy.get("div.flex-col > div:nth-of-type(3) input").type(
          "Minum tiga kali sehari, setelah makan"
        );
        cy.get("#save-btn").click();
      });

      // resep racikan

      let racikan = [
        { nama: "Guaifenesin", dosis: 300 },
        { nama: "Dextromethorphan", dosis: 120 },
        { nama: "Telfast Plus 10 Tablet", dosis: 200 },
      ];

      cy.get("div.gap-4 div:nth-of-type(2) > div.flex p").click();
      cy.get("#modal-root div.css-19bb58m").click();

      Cypress._.each(racikan, ({ nama, dosis }) => {
        cy.get('[class*="css-"][class*="-control"]').eq(0).click();
      
        cy.get('[id^="react-select-"][id$="-input"]')
          .eq(0)
          .type(nama, { force: true });
      
        cy.get('[id^="react-select-"][id$="-listbox"]')
          .eq(0)
          .contains(nama, { timeout: 10000 })
          .should("be.visible")
          .click();
      
        cy.contains(".w-full.flex", nama)
          .should("be.visible")
          .within(() => {
            cy.get("input") // Gantilah jika ada selector spesifik untuk dosis
              .clear()
              .type(dosis.toString(), { force: true });
          });
      });




        cy.get("div.w-3\\/4 input").type("Racikan 1");
        cy.get("#counter-input").clear().type(3);
        cy.get("div.space-y-3 > div:nth-of-type(2) input").type(
          "Minum tiga kali sehari, setelah makan"
        );
        cy.get("#save-btn p").click();
        //save all resep
        cy.get('.mt-6 > :nth-child(2) > ._container__button_17c3w_1').click();
        //oke di modal sukses
        cy.get('.w-full > ._container__button_17c3w_1').click();
      
  
});

});

      
  

it.skip('harus menampilkan form login', () => {

  cy.clickSidebarMenu('Layanan', 'Rawat Jalan'); 
  cy.get("#root > div > div:nth-of-type(2) button._button__primary_17c3w_37 p").eq(0).click();
  cy.get("div.gap-x-4 > div:nth-of-type(2) p").click();
  cy.get("#sidebar").click();
  cy.get("#temperature").click();
  cy.get("#temperature").type("23");
  cy.get("#height").click();
  cy.get("#height").type("23");
  cy.get("#weight").click();
  cy.get("#weight").type("23");
  cy.get("#systolic").click();
  cy.get("#systolic").type("23");
  cy.get("#diastolic").click();
  cy.get("#diastolic").type("23");
  cy.get("#respiration_rate").click();
  cy.get("#respiration_rate").type("23");
  cy.get("#pulse_rate").click();
  cy.get("#pulse_rate").type("23");
  cy.get("#heart_rate").click();
  cy.get("#heart_rate").type("23");
  cy.get("div.flex-col > div.flex > div:nth-of-type(2) p").click();
  cy.get("div.flex-col > div:nth-of-type(1) div:nth-of-type(1) > textarea").click();
  cy.get("div.flex-col > div:nth-of-type(1) div:nth-of-type(1) > textarea").type("rrr");
  cy.get("#psychosocial_spiritual").click();
  cy.get("#psychosocial_spiritual").type("rrr");
  cy.get("#patient_health_history").click();
  cy.get("#patient_health_history").type("rrr");
  cy.get("#family_health_history").click();
  cy.get("#family_health_history").type("rrr");
  cy.get("#medication_history").click();
  cy.get("#medication_history").type("rrr");
  // cy.get('[class*="css-"][class*="-control"]').eq(0).click();
  cy.get('[id^="react-select-"][id$="-input"]')
    .eq(0)
    .type("Gangguan menelan", {timeout: 2000}, { force: true })
    .then(() => {
      cy.get('[id^="react-select-"][id$="-listbox"]')
        .contains("Gangguan menelan", {timeout: 2000})
        .should("be.visible")
        .click();
    });
    cy.get('.justify-between > :nth-child(2) > ._container__button_17c3w_1')
      .then(() => {
        cy.get(".typography__variant-buttonHeavy2")
          .contains("Pemeriksaan Selesai", { timeout: 2000 })
          .should("be.visible");
        // .click();
      });
  

  });




