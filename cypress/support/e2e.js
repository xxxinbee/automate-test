// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
// Akan menangkap unhandled exception yang tidak ingin kamu tangani
Cypress.on('uncaught:exception', (err, runnable) => {
    // Filter hanya error unhandled promise rejection
    if (err.message.includes('unhandled promise rejection')) {
      return false; // jangan fail test
    }
    return true; // biarkan error lain tetap menyebabkan fail
  });
  