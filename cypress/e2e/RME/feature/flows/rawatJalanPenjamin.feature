Feature: Mediverse RME Registration Rawat Jalan

@regis_rawat_jalan_penjamin
  Scenario: Self Registration - Klinik - Rawat Jalan - Penjamin
    Given I open the kiosk registration page 
    When I choose "Belum Terdaftar" option
    And I choose "Daftar secara Mandiri" 
    And as "Penjamin" patient I submit valid patient data
    And I choose "Klinik" and "Umum" and "Dr Matthew" to register for
    Then I should see a registration confirmation message

 Scenario: Processing - Rawat Jalan - Perawat
    Given I open the mediverse login page and log in as "Perawat" with valid credentials
    When I navigate to "Layanan" select "Rawat Jalan" and click "Dalam Antrian" tab
    And I select patient 'Rawat Jalan' 'Penjamin' for assesment
    And I complete the assessment and soap forms with valid data
    Then I should see a success message indicating the patient has been processed 
    And Status updated to "Diperiksa"

   Scenario: Processing - Rawat Jalan - Dokter
    Given I open the mediverse login page and log in as "Dokter" with valid credentials
    When I navigate to "Layanan" select "Rawat Jalan" and click "Berlangsung" tab
    And I select patient 'Rawat Jalan' 'Penjamin' for treatment
    And I complete the soap forms with valid data
    And I fill in the procedure treatment details 
    And I add prescription medications
    And I add compounded medications 
    And I save all entries
    #error yg ini
    Then I should see a success message indicating the patient has been processed 
    And Status updated to "Ditindak"