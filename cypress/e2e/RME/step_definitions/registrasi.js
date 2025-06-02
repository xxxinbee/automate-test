import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import elements from "../../locators";
import dayjs from "dayjs";
import "dayjs/locale/id";
import patientData from "../../../fixtures/patientData.json";

Given("I open the kiosk registration page", () => {
  const kioskUrl = Cypress.env("KIOSK_URL");
  cy.visit(kioskUrl);
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

When("I as {string} patient type complete and submit the patient data form with valid data",
  (patientType) => {
    const sequenceUmum = patientData.idNIK.split("");
    const sequencePenjamin = patientData.idPenjamin.split("");
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
        patientData.birthMonthIndex
      );
      cy.get(elements.kiosk.registrasi.patientDataForm.birthYearSelect).select(
        patientData.birthYear
      );

      // select date -> visible days only
      cy.get(elements.kiosk.registrasi.patientDataForm.birthDay)
        .not(".react-datepicker__day--outside-month")
        .contains(new RegExp(`^${patientData.birthDay}$`))
        .click({ force: true });
      cy.get(elements.kiosk.registrasi.patientDataForm.searchButton).click();
      cy.wait(15000); // Wait for the input to be ready
      cy.get(elements.kiosk.registrasi.patientDataForm.name).should(
        "have.value",
        patientData.name
      );
    } else if (patientType === "Penjamin") {
      cy.get(elements.kiosk.registrasi.patientType)
        .contains(patientType)
        .click();
      cy.get(
        elements.kiosk.registrasi.patientDataForm.penjaminSelector
      ).click();
      cy.get('input[role="combobox"]').type(patientData.tipePenjamin);
      cy.get('div[id*="-option-"]').contains(patientData.tipePenjamin).click();
      cy.get(elements.kiosk.registrasi.patientDataForm.patientId).click();
      sequencePenjamin.forEach((num) => {
        cy.contains("button", num).click();
      });
      cy.get(
        elements.kiosk.registrasi.patientDataForm.searchPenjaminPatient
      ).click();
      cy.get(elements.kiosk.registrasi.patientDataForm.namePenjamin).should(
        "have.value",
        patientData.name
      );
    }

    cy.get(elements.kiosk.registrasi.patientDataForm.nextButton).click();
  }
);

// step definitions to be flexible and support with more than 2 params, based on testcase requirements
When(/^I choose "([^"]+)" and "([^"]+)"(?: and "([^"]+)")? to register for$/, (service, subservice1, subservice2) => {
    // data to assert
    const patientType = Cypress.env("currentPatientType");
    const appointmentQueueAPI = Cypress.env("APPOINTMENT_QUEUE_API");
    dayjs.locale("id");
    const serviceSchedule = dayjs().format("dddd, D MMMM YYYY");
    const serviceHours = "07:00 - 23:00";

    const expectedTexts = [
      patientType,
      service,
      subservice1,
      subservice2,
      serviceSchedule,
      serviceHours,
    ].filter(Boolean); // Filter out any undefined values

    cy.contains(service).click();

    switch (service) {
      case "Imunisasi":
        cy.get(elements.kiosk.registrasi.imunisasi.dropdownVaccine).click();
        cy.contains(subservice1, { timeout: 10000 })
          .should("be.visible")
          .click();
        // cy.get('body').type('{esc}');  
        cy.get(elements.kiosk.registrasi.imunisasi.fieldDropdownVaccine).click();
        break;

      case "Klinik":
        cy.get(".css-1gazu85-control").click();
        cy.get("#react-select-2-input")
          .type(subservice1, { force: true })
          .then(() => {
            cy.get("#react-select-2-listbox")
              .contains(subservice1, { timeout: 10000 })
              .should("be.visible")
              .click();
          });

        cy.get("#react-select-3-input")
          .type(subservice2, { force: true, delay: 100 })
          .then(() => {
            cy.get("#react-select-3-listbox").contains(subservice2).click();
          });
        break;
    }

    // Click Register
    cy.get(elements.kiosk.registrasi.registerButton, { timeout: 10000 })
      .should("be.visible")
      .click();

    // Assert nama pasien dan tanggal lahir
    cy.get(elements.kiosk.registrasi.patientNameLabel)
    .should("have.text", patientData.name);

    cy.get(elements.kiosk.registrasi.patientBirthDateLabel)
    .should("have.text",patientData.birthDate);

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
    cy.captureQueueCode("@register", service);
  }
);

Then("I should see a registration confirmation message", () => {
  cy.get(elements.kiosk.registrasi.successMessage).should(
    "have.text",
    "Terima kasih!"
  );
});
