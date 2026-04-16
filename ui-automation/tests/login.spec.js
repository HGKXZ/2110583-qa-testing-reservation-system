import { test, expect } from '@playwright/test';
import { testData } from '../data/loginData';
import { LoginPage } from '../pages/LoginPage';

//FR-01 : Registration, 
test.describe('Registration & Login', () => {

  test.beforeEach(async ({ page }) => {
    const LoginPage = new LoginPage(page);
    await LoginPage.goto();
  });

  //TC-001-001
  test('Verify successful registration with valid fields', async ({ page }) => {
    const data = testData.validUser;
    
    await LoginPage.register(
      data.firstName,
      data.phone,
      data.email,
      data.password
    );

    const successMessage = page.getByText('Registration successful');
    await expect(successMessage).toBeVisible();
  });

  //TC-002-001
  test('Login with valid credentials', async ({ page }) => {
    const data = testData.validUser;

    await LoginPage.login(
      data.email,
      data.password
    );

    await expect(page).toHaveURL(/.*Home\/Dashboard/);
  });

  //TC-002-002
  test('Login denial for Invalid Password', async ({ page }) => {
    const validData = testData.validUser;
    const invalidData = testData.unregisteredUser;
    
    await LoginPage.login(
      validData.email,
      invalidData.password
    );

    const errorBox = page.locator('.error-message'); 
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toHaveText('Invalid credentials');
  });

  //TC-002-003
  test('Login denial for Unregistered Email', async ({ page }) => {
    const validData = testData.validUser;
    const invalidData = testData.unregisteredUser;
    
    await LoginPage.login(
      invalidData.email,
      validData.password
    );

    const errorBox = page.locator('.error-message'); 
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toHaveText('Invalid credentials');
  });
});  