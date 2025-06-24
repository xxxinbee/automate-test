Cypress.Commands.add("captureQueueCode", (aliasName, service, patientType) => {
  cy.wait(aliasName).then((interception) => {
    console.log(interception.response.body);

    expect(interception.response.body).to.exist;
    expect(interception.response.body.message).to.exist;

    const queueCode = interception.response.body.message.queue_code;
    expect(queueCode).to.exist;

    const data = {};
    data[`${service}queue - ${patientType}`] = queueCode;

    cy.task("saveQueueCodeToFile", data);
  });
});

Cypress.Commands.add("Login", (email, password) => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    if (err.message.includes("Failed to register a ServiceWorker")) {
      return false; // Abaikan error dan lanjutkan test
    }
  });
  cy.visit(Cypress.env("BASE_URL"));
  cy.get("#email-user-input").type(email);
  cy.get("#password-user-input").type(password);
  cy.get("#login-btn").click();
  cy.get('.text-primary.typography__variant-h1.mt-2').should('be.visible').and('contain', 'Dashboard');

});


Cypress.Commands.add('clickSidebarMenu', (mainMenu, subMenu = null) => {
  const normalize = (str) =>
    str.toLowerCase().replace(/\s+/g, '').trim(); // contoh: 'Rawat Jalan' → 'rawatjalan'

  cy.get('#sidebar').click(); // Pastikan sidebar terbuka sebelum mencari menu
  const menuSelectors = {
    dashboard: {
      selector: '#dashboard-dropdown',
    },
    layanan: {
      selector: '#layanan-dropdown',
      submenus: {
        rawatjalan: '#clinic-outpatients',
        imunisasi: '#vaccinations',
        laboratorium: '#laboratoriums',
      },
    },
    transaksi: {
      selector: '#transaksi-dropdown',
      submenus: {
        pembayaran: '#payment',
      },
    },
  };

  const mainKey = normalize(mainMenu);
  const subKey = subMenu ? normalize(subMenu) : null;

  const main = menuSelectors[mainKey];

  if (!main) {
    throw new Error(`Main menu "${mainMenu}" tidak ditemukan.`);
  }

  cy.get(main.selector).click();

  if (subKey) {
    if (!main.submenus || !main.submenus[subKey]) {
      throw new Error(`Submenu "${subMenu}" tidak ditemukan di "${mainMenu}".`);
    }
    cy.get(main.submenus[subKey]).click();
  }
  cy.get('#sidebar').click(); // Pastikan sidebar tertutup lagi
});

