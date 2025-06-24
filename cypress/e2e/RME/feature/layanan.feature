Feature: Mediverse RME Layanan

  # Scenario: Processing - Rawat Jalan - Perawat
  #   Given I open the mediverse login page and log in as "Perawat" with valid credentials
  #   When I navigate to "Layanan" select "Rawat Jalan" and click "Dalam Antrian" tab
  #   And I select patient 'Rawat Jalan' 'Umum' for assesment
  #   And I complete the assessment and soap forms with valid data
  #   Then I should see a success message indicating the patient has been processed 
  #   And Status updated to "Diperiksa"

  #  Scenario: Processing - Rawat Jalan - Dokter
  #   Given I open the mediverse login page and log in as "Dokter" with valid credentials
  #   When I navigate to "Layanan" select "Rawat Jalan" and click "Berlangsung" tab
  #   And I select patient 'Rawat Jalan' 'Umum' for treatment
  #   And I complete the soap forms with valid data
  #   And I fill in the procedure treatment details 
  #   And I add prescription medications
  #   And I add compounded medications 
  #   And I save all entries
  #   #error yg ini
  #   Then I should see a success message indicating the patient has been processed 
  #   And Status updated to "Ditindak"

  Scenario: Completing - Rawat Jalan - Dokter
    Given I open the mediverse login page and log in as "Dokter" with valid credentials
    When I navigate to "Layanan" select "Rawat Jalan" and click "Ditindak" tab
    And I select patient 'Rawat Jalan' 'Umum' to complete the procedure
    Then I should see a success message indicating the patient has been processed 
    And Status updated to "Selesai"


