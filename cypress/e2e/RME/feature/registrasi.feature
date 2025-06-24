Feature: Mediverse RME Registration



  @regis_imunisasi_umum
  Scenario: Self Registration - Imunisasin- Umum
    Given I open the kiosk registration page
    When I choose "Belum Terdaftar" option
    And I choose "Daftar secara Mandiri"
    And as "Umum" patient I submit valid patient data
    And I choose "Imunisasi" and "Vaksinasi Tetanus Difteri (Td)" to register for
    Then I should see a registration confirmation message

  @regis_rawat_jalan_umum
  Scenario: Self Registration - Klinik - Rawat Jalan - Umum
    Given I open the kiosk registration page
    When I choose "Belum Terdaftar" option
    And I choose "Daftar secara Mandiri"
    And as "Umum" patient I submit valid patient data
    And I choose "Klinik" and "Umum" and "Dr Matthew" to register for
    Then I should see a registration confirmation message

  @regis_imunisasi_penjamin
  Scenario: Self Registration - Imunisasi - Penjamin
    Given I open the kiosk registration page
    When I choose "Belum Terdaftar" option
    And I choose "Daftar secara Mandiri"
    And as "Penjamin" patient I submit valid patient data
    And I choose "Imunisasi" and "Vaksinasi Tetanus Difteri (Td)" to register for
    Then I should see a registration confirmation message

  @regis_rawat_jalan_penjamin
  Scenario: Self Registration - Klinik - Rawat Jalan - Penjamin
    Given I open the kiosk registration page
    When I choose "Belum Terdaftar" option
    And I choose "Daftar secara Mandiri"
    And as "Penjamin" patient I submit valid patient data
    And I choose "Klinik" and "Umum" and "Dr Matthew" to register for
    Then I should see a registration confirmation message


 @regis_umum_invalid
  Scenario: Self Registration - Umum - Invalid Data
    Given I open the kiosk registration page
    When I choose "Belum Terdaftar" option
    And I choose "Daftar secara Mandiri"
    And as "Umum" patient I submit invalid patient data
    Then I should see patient unregistered message

  @regis_penjamin_invalid
  Scenario: Self Registration - Penjamin - Invalid Data
    Given I open the kiosk registration page
    When I choose "Belum Terdaftar" option
    And I choose "Daftar secara Mandiri"
    And as "Penjamin" patient I submit invalid patient data
    Then I should see patient unregistered message