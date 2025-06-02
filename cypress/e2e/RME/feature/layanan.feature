Feature: Mediverse RME Layanan

  Scenario: Processing - Rawat Jalan - Perawat
    Given I open the mediverse login page and log in as "Perawat" with valid credentials
    When I navigate to the "Layanan" page and select "Rawat Jalan"
    And I select one of the 'Rawat Jalan' patients in the queue
    # And I complete the assessment and soap forms with valid data
    # Then I should see a success message indicating the patient has been processed 
    # And Status updated to "Diperiksa"