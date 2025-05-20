Feature: Shopping in Saucedemo
  Scenario: Successful login with valid credentials
    Given I open the SauceDemo login page
    When I enter the username "standard_user" and password "secret_sauce"
    And I click the login button
    Then I should be redirected to the inventory page

  Scenario: Unsuccessful login with invalid credentials
    Given I open the SauceDemo login page
    When I enter the username "user1290" and password "password123"
    And I click the login button
    Then I should see an error message

  Scenario: Successfully add products to card
  Given I am logged in as a valid user  
  When I add a product to the cart  
  Then The cart badge should show 1 item  
  And The cart should contain the product I added

  Scenario: Completing checkout process 
  Given I am logged in as a valid user
  When I open the cart page
  And I click checkout button
  And I complete the order form with valid data
  And I click finish button
  Then I should see success checkout message

  Scenario: Checkout product without giving the valid data
  Given I am logged in as a valid user
  When I open the cart page
  And I click checkout button
  And I don't complete the order form
  Then I should error message

