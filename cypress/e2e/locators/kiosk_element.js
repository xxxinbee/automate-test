const elements = {
    registrasi: {
      pilihanRegistrasi: {
        mediverse: ".text-2xl:contains('mediverse')",
        mobileJkn: ".text-2xl:contains('mobileJkn')",
        belumTerdaftar: ":nth-child(3) > .flex-col > .text-2xl",
      },
      layananBelumTerdaftar: ".gap-6 > .flex-col > :nth-child(1) > .flex",
      buttonSelanjutnya: ".Button_container__button__GVUJy",
      patientType: ".flex-col > :nth-child(1) > :nth-child(1) > .gap-3",
      afterSubmitMessage: ".text-base",
      failedMessage: ".text-[#616161]",

      patientDataForm: {
        patientId: "#patient-id",
        name: ":nth-child(5) > div.rounded-lg > .text__input",
        birthDate: ".react-datepicker__input-container > .w-full",
        birthMonthSelect: ".react-datepicker__month-select",
        birthYearSelect: ".react-datepicker__year-select",
        birthDay: ".react-datepicker__day",
        searchButton: ":nth-child(1) > .Button_container__button__GVUJy > .flex > .uppercase",
        penjaminSelector: ".css-1gazu85-control",
        searchPenjaminPatient: ".w-40 > .Button_container__button__GVUJy",
        namePenjamin: ":nth-child(3) > div.rounded-lg > .text__input",
        nextButton: ":nth-child(3) > .Button_button__primary__F5uwv > .flex > .uppercase",
   },

        imunisasi:{
          dropdownVaccine: ".css-19bb58m",
          fieldDropdownVaccine: ".text-left", 
    
        },

        registerButton: ".Button_button__primary__F5uwv",
        patientNameLabel: ".text-left > .text-2xl",
        patientBirthDateLabel: ".text-left > .text-sm",
        patientServiceLabel: ".text-sm.font-bold",
        printButton: ".mt-auto > .Button_container__button__GVUJy",
        successMessage: ".mt-2 > .text-base",

    },
  };
  
  export default elements;
  