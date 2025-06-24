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

When("I navigate to {string} select {string} and click {string} tab", (Menu, Submenu, tab) => {
    cy.clickSidebarMenu(Menu, Submenu);   
    const tabs = {
      "Dalam Antrian": "#Registrasi",
      "Berlangsung": "#Menunggu\\ Tindakan",
      "Ditindak": "#Sudah\\ Ditindak",
      "Selesai": "#Selesai",
      "Batal Periksa": "#Batal"
    };

     // Step 3: Click the specified tab
     const selector = tabs[tab];
     if (!selector) {
         throw new Error(`Tab '${tab}' not found in tabSelectors mapping`);
     }
     cy.get(selector).click();

});

When("I select patient {string} {string} for assesment", (service, patientType) => {
  const selectPatient = () => {
    cy.readFile("cypress/fixtures/queueCode.json").then((data) => {
      const serviceKeys = {
        "Imunisasi": "Imunisasiqueue",
        "Rawat Jalan": "Klinikqueue",
        "Laboratorium": "Laboratorium"
      };
     
      // Generate key untuk pencarian di fixture
      const queueKey = `${serviceKeys[service]} - ${patientType}`;
      const queueCode = data[queueKey];
      Cypress.env("currentQueueNumber", queueCode);
      cy.get('input[name="search"]')
        .clear() // Membersihkan input terlebih dahulu
        .type(queueCode + "{enter}", { force: true, delay: 100 });
      cy.wait(3000);
      
      cy.get("body").then(($body) => {
        const queueFound = $body.find(".tr__class").length > 0;

        if (queueFound) {
          
          cy.get(".tr__class")
            .contains(queueCode)
            .parents("tr")
            .find(".w-56 > ._button__primary_17c3w_37")
            .click();
          cy.get("._container__modal_1irkx_14").within(() => {
            cy.get(":nth-child(2) > ._container__button_17c3w_1").click();
          });
        } else {
          
          // Jalankan test case pembuatan queue
          cy.exec(
            `npx cypress run --spec cypress/e2e/RME/feature/registrasi.feature --env TAGS="@regis_rawat_jalan_umum"`
          ).then((execResult) => {
            if (execResult.code === 0) {
              cy.log("✅ Test case pembuatan queue berhasil dijalankan");
              // Setelah queue dibuat, coba lagi select patient
              selectPatient(); // Rekursif
            } else {
              throw new Error("Gagal menjalankan test case pembuatan queue");
            }
          });
        }
      });
    });
  };

  // Mulai proses pertama kali
  selectPatient();
});



When("I complete the assessment and soap forms with valid data", () =>{
  //fill soap form
  cy.get("#temperature").type(serviceData.pengkajianPasien.suhuTubuh);
  cy.get("#height").type(serviceData.pengkajianPasien.tinggiBadan);
  cy.get("#weight").type(serviceData.pengkajianPasien.beratBadan);
  cy.get("#systolic").type(serviceData.pengkajianPasien.sistol);
  cy.get("#diastolic").type(serviceData.pengkajianPasien.diastol);
  cy.get("#respiration_rate").type(serviceData.pengkajianPasien.pernapasan);
  cy.get("#pulse_rate").type(serviceData.pengkajianPasien.nadi);
  cy.get("#heart_rate").type(serviceData.pengkajianPasien.detakJantung);
  cy.get("div.flex-col > div.flex > div:nth-of-type(2) p").click();
  cy.get("div.flex-col > div:nth-of-type(1) div:nth-of-type(1) > textarea").type(serviceData.pengisianSOAPPerawat.keluhanPasien);
  cy.get("#psychosocial_spiritual").type(serviceData.pengisianSOAPPerawat.psikososialSpiritual);
  cy.get("#patient_health_history").type(serviceData.pengisianSOAPPerawat.riwayatKesehatanPasien);
  cy.get("#family_health_history").type(serviceData.pengisianSOAPPerawat.riwayatKesehatanKeluarga);
  cy.get("#medication_history").type(serviceData.pengisianSOAPPerawat.riwayatPenggunaanObat);
  cy.get('[id^="react-select-"][id$="-input"]')
    .eq(0)
    .type(serviceData.pengisianSOAPPerawat.assessment, { timeout: 2000 }, { force: true })
    .then(() => {
      cy.get('[id^="react-select-"][id$="-listbox"]')
        .contains(serviceData.pengisianSOAPPerawat.assessment, { timeout: 2000 })
        .should("be.visible")
        .click();
    });
  //simpan soap perawat
  cy.get('.justify-between > :nth-child(2) > ._container__button_17c3w_1')
  .then(() => {
    cy.get(".typography__variant-buttonHeavy2")
      .contains("Pemeriksaan Selesai", { timeout: 2000 })
      .should("be.visible")
      .click();
  });

})

Then("I should see a success message indicating the patient has been processed", () =>{
    cy.get('._container__modal_1irkx_14').within(() => {
      cy.get('.typography__variant-subtitle4').contains("Sukses!")
      // cy.get('.mt-1 > .text-gray-500').contains("Berhasil melakukan pemeriksaan pasien")
      cy.get('.w-full > ._container__button_17c3w_1').click()
    });
});

Then("Status updated to {string}", (status) => {
  // const queueCode = Cypress.env("currentQueueNumber");
  
  // cy.get("#Menunggu\\ Tindakan") // karena id-nya ada spasi, perlu escape
  //   .should("have.class", "border-b-2")
  //   .and("have.class", "border-b-primary");

  // cy.get('input[name="search"]').type(queueCode, { force: true });
  // cy.wait(3000);
  // cy.get(".tr__class").within(() => {
  //   cy.contains("No Antrian:").next("h4").should("have.text", queueCode);
  //   cy.contains("Pasien:").next("h4").should("have.text", "Jajang Supriatna");
  //   // cy.get("h4").contains("DIPERIKSA").should("be.visible");
  // });

    const queueCode = Cypress.env("currentQueueNumber");
    const patientName = "Jajang Supriatna"; // Consider making this dynamic if needed
  
    // Map status to their corresponding selectors
    const statusSelectors = {
      "Dalam Antrian": "#Registrasi",
      "Diperiksa": "#Menunggu\\ Tindakan",
      "Ditindak": "#Sudah\\ Ditindak",
      "Selesai": "#Selesai"
    };
  
    // Verify the correct status tab is active
    cy.get(statusSelectors[status])
      .should("have.class", "border-b-2")
      .and("have.class", "border-b-primary");
  
    // Search for the patient
    cy.get('input[name="search"]').type(queueCode, { force: true });
    cy.wait(3000); // Consider replacing with a more reliable wait
    
    // Verify patient details
    cy.get(".tr__class").within(() => {
      cy.contains("No Antrian:").next("h4").should("have.text", queueCode);
      cy.contains("Pasien:").next("h4").should("have.text", patientName);
      
      // If you need to verify status in the row (uncomment if needed)
      // cy.get("h4").contains(status.toUpperCase()).should("be.visible");
    });
  });




// Doctor

When("I select patient {string} {string} for treatment", (service, patientType) => {
  const selectPatient = () => {
    cy.readFile("cypress/fixtures/queueCode.json").then((data) => {
      const serviceKeys = {
        "Imunisasi": "Imunisasiqueue",
        "Rawat Jalan": "Klinikqueue",
        "Laboratorium": "Laboratorium"
      };
     
      // Generate key untuk pencarian di fixture
      const queueKey = `${serviceKeys[service]} - ${patientType}`;
      const queueCode = data[queueKey];
      Cypress.env("currentQueueNumber", queueCode);
      cy.get('input[name="search"]')
        .clear() // Membersihkan input terlebih dahulu
        .type(queueCode + "{enter}", { force: true, delay: 100 });
      cy.wait(3000);
      
      cy.get("body").then(($body) => {
        const queueFound = $body.find(".tr__class").length > 0;

        if (queueFound) {
          
          cy.get(".tr__class")
            .contains(queueCode)
            .parents("tr")
            .find(".w-56 > ._button__primary_17c3w_37")
            .click();
          cy.get("._container__modal_1irkx_14").within(() => {
            cy.get(":nth-child(2) > ._container__button_17c3w_1").click();
          });
        } else {
          
          // Jalankan test case pembuatan queue
          cy.exec(
            `npx cypress run --spec cypress/e2e/RME/feature/registrasi.feature --env TAGS="@regis_rawat_jalan_umum"`
          ).then((execResult) => {
            if (execResult.code === 0) {
              cy.log("✅ Test case pembuatan queue berhasil dijalankan");
              // Setelah queue dibuat, coba lagi select patient
              selectPatient(); // Rekursif
            } else {
              throw new Error("Gagal menjalankan test case pembuatan queue");
            }
          });
        }
      });
    });
  };

  // Mulai proses pertama kali
  selectPatient();
});


When("I complete the soap forms with valid data", ()=>{
  cy.scrollTo('bottom')
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


})
    

When("I fill in the procedure treatment details", ()=>{
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
  
})

When("I add prescription medications", ()=>{
  let medicines = ["Antasida", "Guaifenesin", "Paracetamol"];
  cy.get(':nth-child(3) > .flex > .text-center')
  cy.get("button:nth-of-type(3) p").click();
  cy.get("#yes").click();
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

})

When("I add compounded medications", ()=>{
  cy.viewport(1728,1117)
  let racikan = [
    { nama: "CTM (Chlorpheniramine", dosis: 200 },
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
cy.get('#counter-input').type(3);
cy.get("div.space-y-3 > div:nth-of-type(2) input").type(
  "Minum tiga kali sehari, setelah makan"
);
cy.get("#save-btn p").click();
//save all resep
cy.get('.mt-6 > :nth-child(2) > ._container__button_17c3w_1').click();
//oke di modal sukses
cy.get('.w-full > ._container__button_17c3w_1').click();
})



When("I save all entries", ()=>{
  cy.get("div.w-full > div.mb-4 p").click();
  // cy.get("#modal-root div.flex-col > div.flex p").click();
})

When("I select patient {string} {string} to complete the procedure", (service, patientType) => {
  const selectPatient = () => {
    cy.readFile("cypress/fixtures/queueCode.json").then((data) => {
      const serviceKeys = {
        "Imunisasi": "Imunisasiqueue",
        "Rawat Jalan": "Klinikqueue",
        "Laboratorium": "Laboratorium"
      };
     
      // Generate key untuk pencarian di fixture
      const queueKey = `${serviceKeys[service]} - ${patientType}`;
      const queueCode = data[queueKey];
      Cypress.env("currentQueueNumber", queueCode);
      cy.get('input[name="search"]')
        .clear() // Membersihkan input terlebih dahulu
        .type(queueCode + "{enter}", { force: true, delay: 100 });

      cy.get("tr:nth-of-type(1) button._button__primary_17c3w_37 p").click();
      
      
      cy.get(':nth-child(2) > ._container__button_17c3w_1').click();
      cy.wait(3000)
    
    });
  };

  // Mulai proses pertama kali
  selectPatient();
});