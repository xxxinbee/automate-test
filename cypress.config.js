const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
const { defineConfig } = require("cypress");

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const PATIENT_FILE_PATH = path.join(__dirname, "cypress", "fixtures", "patientData.json");
const QUEUE_FILE_PATH = path.join(__dirname, "cypress", "fixtures", "queueCode.json");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],

      });
      config.typescript = {
        enableTypeScript: false,
      };
      on("file:preprocessor", bundler);
      addCucumberPreprocessorPlugin(on, config);

      on("task", {
        // Task menyimpan queue code ke file queueCode.json
        saveQueueCodeToFile(data) {
          let existing = {};
          if (fs.existsSync(QUEUE_FILE_PATH)) {
            existing = JSON.parse(fs.readFileSync(QUEUE_FILE_PATH, "utf8"));
          }
        
          // Gabungkan/meng-overwrite berdasarkan key di data
          Object.keys(data).forEach((key) => {
            existing[key] = data[key];
          });
        
          fs.writeFileSync(QUEUE_FILE_PATH, JSON.stringify(existing, null, 2));
          return null;
        },

        // Menyimpan data ke patientData.json
        saveData({ key, value }) {
          let data = {};
          if (fs.existsSync(QUEUE_FILE_PATH)) {
            data = JSON.parse(fs.readFileSync(QUEUE_FILE_PATH, "utf8"));
          }
        
          // Simpan dalam format { key: value }
          data[key] = value;
        
          fs.writeFileSync(QUEUE_FILE_PATH, JSON.stringify(data, null, 2));
          return null;
        },

        // Mengambil data dari patientData.json
        getData(key) {
          if (fs.existsSync(QUEUE_FILE_PATH)) {
            const data = JSON.parse(fs.readFileSync(QUEUE_FILE_PATH, "utf8"));
            return data[key] || null;
          }
          return null;
        
        },
      });

      return config;
    },

    specPattern: ["cypress/e2e/**/*.feature", "**/*.cy.{js,jsx,ts,tsx}"],


    env: {
      KIOSK_URL: process.env.KIOSK_URL,
      BASE_URL: process.env.BASE_URL,
      APPOINTMENT_QUEUE_API: process.env.APPOINTMENT_URL,
      PERAWAT_EMAIL: process.env.PERAWAT_EMAIL,
      OPERATOR_EMAIL: process.env.OPERATOR_EMAIL,
      DOKTER_EMAIL: process.env.DOKTER_EMAIL,
      PASSWORD: process.env.PASSWORD,
    },
  },

  video: true,
});