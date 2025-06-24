Feature: Mediverse RME Registration Helper


 @regis_rawat_jalan_umum_invalid
  Scenario: Self Registration - Umum - Invalid Data
    Given I open the kiosk registration page
    When I choose "Belum Terdaftar" option
    And I choose "Daftar secara Mandiri"
    And as "Penjamin" patient I submit invalid patient data
    Then I should see patient unregistered message

