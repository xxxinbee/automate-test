import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import elements from "../../locators";
import dayjs from "dayjs";
import "dayjs/locale/id";
import patientData from "../../../fixtures/patientData.json";

Given("I open the kiosk registration page", () => {
  // const kioskUrl = Cypress.env("KIOSK_URL");
  cy.visit(Cypress.env("KIOSK_URL"));
  cy.viewport(1764, 954); // Set viewport size for kiosk
});

When("I choose {string} option", (option) => {
  cy.contains(option).click();
});

When("I choose {string}", (option) => {
  cy.get(elements.kiosk.registrasi.layananBelumTerdaftar)
    .contains(option)
    .click();
  cy.get(elements.kiosk.registrasi.buttonSelanjutnya).click();
});

When("as {string} patient I submit valid patient data",
  (patientType) => {
    const sequenceUmum = patientData.Valid.idNIK.split("");
    const sequencePenjamin = patientData.Valid.idPenjamin.split("");
   
    Cypress.env("currentPatientType", patientType);

    if (patientType === "Umum") {
      cy.get(elements.kiosk.registrasi.patientType)
        .contains(patientType)
        .click();
      // input NIK
      cy.get(elements.kiosk.registrasi.patientDataForm.patientId).click();
      sequenceUmum.forEach((num) => {
        cy.contains("button", num).click();
      });

      cy.get(elements.kiosk.registrasi.patientDataForm.birthDate).click();
      // Select month and year
      cy.get(elements.kiosk.registrasi.patientDataForm.birthMonthSelect).select(
        patientData.Valid.birthMonthIndex
      );
      cy.get(elements.kiosk.registrasi.patientDataForm.birthYearSelect).select(
        patientData.Valid.birthYear
      );

      // select date -> visible days only
      cy.get(elements.kiosk.registrasi.patientDataForm.birthDay)
        .not(".react-datepicker__day--outside-month")
        .contains(new RegExp(`^${patientData.Valid.birthDay}$`))
        .click({ force: true });

      cy.get(elements.kiosk.registrasi.patientDataForm.searchButton).click();
      cy.wait(1500); // Wait for the input to be ready
      cy.get(elements.kiosk.registrasi.patientDataForm.name).should(
        "have.value",
        patientData.Valid.name
      );
    } else if (patientType === "Penjamin") {
      cy.get(elements.kiosk.registrasi.patientType)
        .contains(patientType)
        .click();
      cy.get(
        elements.kiosk.registrasi.patientDataForm.penjaminSelector
      ).click();
      cy.get('input[role="combobox"]').type(patientData.Valid.tipePenjamin);
      cy.get('div[id*="-option-"]').contains(patientData.Valid.tipePenjamin).click();

      cy.get(elements.kiosk.registrasi.patientDataForm.birthDate).click();
      // Select month and year
      cy.get(elements.kiosk.registrasi.patientDataForm.birthMonthSelect).select(
        patientData.Valid.birthMonthIndex
      );
      cy.get(elements.kiosk.registrasi.patientDataForm.birthYearSelect).select(
        patientData.Valid.birthYear
      );
      cy.get(elements.kiosk.registrasi.patientDataForm.birthDay)
      .not(".react-datepicker__day--outside-month")
      .contains(new RegExp(`^${patientData.Valid.birthDay}$`))
      .click({ force: true });

      // input id penjamin
      cy.get(elements.kiosk.registrasi.patientDataForm.patientId).click();
      sequencePenjamin.forEach((num) => {
        cy.contains("button", num).click();
      });
      cy.get(
        elements.kiosk.registrasi.patientDataForm.searchPenjaminPatient
      ).click();
      cy.get(elements.kiosk.registrasi.patientDataForm.namePenjamin).should(
        "have.value",
        patientData.Valid.name
      );
    }

    cy.get(elements.kiosk.registrasi.patientDataForm.nextButton).click();
  }
);

// step definitions to be flexible and support with more than 2 params, based on testcase requirements
When(/^I choose "([^"]+)" and "([^"]+)"(?: and "([^"]+)")? to register for$/, (service, subservice1, subservice2) => {
  // data to assert
  const patientType = Cypress.env("currentPatientType");
  const penjaminName = patientData.Valid.tipePenjamin;
  const appointmentQueueAPI = Cypress.env("APPOINTMENT_QUEUE_API");
  dayjs.locale("id");
  const serviceSchedule = dayjs().format("dddd, D MMMM YYYY");
  const serviceHours = "00:00 - 23:59"; // Default service hours

  let expectedTexts = [
    patientType,
    service,
    subservice1,
    subservice2,
    serviceSchedule,
    serviceHours,
  ].filter(Boolean); // Filter out any undefined values

  // modif array jika patientType adalah "umum"
  // if (patientType === "Umum") {
  //   // Jika patientType adalah "umum", tidak perlu memasukkan penjaminName
  //   expectedTexts = [
  //     patientType,
  //     service,
  //     subservice1,
  //     subservice2,
  //     serviceSchedule,
  //     serviceHours,
  //   ].filter(Boolean); // Menghapus nilai undefined
  // } else if (patientType === "Penjamin") {
  //   expectedTexts = [
  //     patientType,
  //     // penjaminName, 
  //     service,
  //     subservice1,
  //     subservice2,
  //     serviceSchedule,
  //     serviceHours,
  //   ].filter(Boolean); // Filter out undefined values
  // }

  cy.contains(service).click();

  switch (service) {
    case "Imunisasi":
      cy.get(elements.kiosk.registrasi.imunisasi.dropdownVaccine).click();
      // pake filter karena id dropdownnya berubah-ubah
      cy.get('[id^="react-select-"][id$="-listbox"]')
        .contains(subservice1)
        .click();
      cy.get(elements.kiosk.registrasi.imunisasi.fieldDropdownVaccine).click();
      break;

    case "Klinik":
      //poli
      cy.get('[class*="css-"][class*="-control"]').eq(0).click();
      cy.get('[id^="react-select-"][id$="-input"]').eq(0)
        .type(subservice1, { force: true })
        .then(() => {
          cy.get('[id^="react-select-"][id$="-listbox"]').eq(0)
            .should("be.visible")
            .click();
        });

        //sub layanan
        cy.get('[class*="css-"][class*="-control"]').eq(1).click();
        cy.get('[id^="react-select-"][id$="-input"]').eq(1)
          .type(subservice2, { force: true })
          .then(() => {
            cy.get('[id^="react-select-"][id$="-listbox"]').eq(0)
              .contains(subservice2, { timeout: 10000 })
              .should("be.visible")
              .click();
          });  

      break;
  }

  // Click Daftarkan
  cy.wait(1000); // Wait for the service to be selected
  cy.get(elements.kiosk.registrasi.registerButton, { wait: 1000 })
    .should("be.visible")
    .click();

  // Assert nama pasien dan tanggal lahir
  cy.get(elements.kiosk.registrasi.patientNameLabel).should(
    "have.text",
    patientData.Valid.name
  );

  cy.get(elements.kiosk.registrasi.patientBirthDateLabel).should(
    "have.text",
    patientData.Valid.birthDate
  );

  // Assert informasi layanan (patient type, service, subservice, [doctor])
  cy.get(elements.kiosk.registrasi.patientServiceLabel).each(($el, index) => {
    expect($el.text().trim()).to.eq(expectedTexts[index]);
  });

  // Intercept & print queue
  cy.intercept("POST", appointmentQueueAPI).as("register");
  cy.get(elements.kiosk.registrasi.printButton)
    .should("be.visible")
    .should("not.be.disabled")
    .click();
  cy.captureQueueCode("@register", service, patientType,);
}
);

Then("I should see a registration confirmation message", () => {
  cy.get(elements.kiosk.registrasi.successMessage).should(
    "have.text",
    "Terima kasih!"
  );
});


When("as {string} patient I submit invalid patient data",
  (patientType) => {
    const sequenceUmum = patientData.Invalid.idNIK.split("");
    const sequencePenjamin = patientData.Invalid.idPenjamin.split("");
   
    Cypress.env("currentPatientType", patientType);

    if (patientType === "Umum") {
      cy.get(elements.kiosk.registrasi.patientType)
        .contains(patientType)
        .click();
      // input NIK
      cy.get(elements.kiosk.registrasi.patientDataForm.patientId).click();
      sequenceUmum.forEach((num) => {
        cy.contains("button", num).click();
      });

      cy.get(elements.kiosk.registrasi.patientDataForm.birthDate).click();
      // Select month and year
      cy.get(elements.kiosk.registrasi.patientDataForm.birthMonthSelect).select(
        patientData.Invalid.birthMonthIndex
      );
      cy.get(elements.kiosk.registrasi.patientDataForm.birthYearSelect).select(
        patientData.Invalid.birthYear
      );

      // select date -> visible days only
      cy.get(elements.kiosk.registrasi.patientDataForm.birthDay)
        .not(".react-datepicker__day--outside-month")
        .contains(new RegExp(`^${patientData.Invalid.birthDay}$`))
        .click({ force: true });

      cy.get(elements.kiosk.registrasi.patientDataForm.searchButton).click();
      cy.wait(1500); // Wait for the input to be ready
   
    } else if (patientType === "Penjamin") {
      cy.get(elements.kiosk.registrasi.patientType)
        .contains(patientType)
        .click();
      cy.get(
        elements.kiosk.registrasi.patientDataForm.penjaminSelector
      ).click();
      cy.get('input[role="combobox"]').type(patientData.Invalid.tipePenjamin);
      cy.get('div[id*="-option-"]').contains(patientData.Invalid.tipePenjamin).click();

      cy.get(elements.kiosk.registrasi.patientDataForm.birthDate).click();
      // Select month and year
      cy.get(elements.kiosk.registrasi.patientDataForm.birthMonthSelect).select(
        patientData.Invalid.birthMonthIndex
      );
      cy.get(elements.kiosk.registrasi.patientDataForm.birthYearSelect).select(
        patientData.Invalid.birthYear
      );
      cy.get(elements.kiosk.registrasi.patientDataForm.birthDay)
      .not(".react-datepicker__day--outside-month")
      .contains(new RegExp(`^${patientData.Invalid.birthDay}$`))
      .click({ force: true });

      // input id penjamin
      cy.get(elements.kiosk.registrasi.patientDataForm.patientId).click();
      sequencePenjamin.forEach((num) => {
        cy.contains("button", num).click();
      });
      cy.get(
        elements.kiosk.registrasi.patientDataForm.searchPenjaminPatient
      ).click();
     
    }

  }
);

Then("I should see patient unregistered message", () => {
  cy.get(".relative.w-full")
  .should("be.visible")
  .within(() => {
    cy.get(".text-xs.text-black")
      .contains("Data Pasien tidak ditemukan!")
      .and("be.visible");
  }
  );
 

});