import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { LoginPage } from '../pages/Auth/LoginPage';

test.describe('Security Test: Password Policy (Mocked API)', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    
    await registerPage.goto();
  });

  test('TC-SEC-001: Verify password below minimum boundary (7 chars)', async ({ page }) => {
    // MOCK API return HTTP 400 Failed
    await page.route('https://mock-api.com/auth/register', route => {
    route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid password policy' })
    });
    });

    // register
    await registerPage.fillRegistrationForm('John', 'sec01@test.com', '0812345678', 'Valid12'); // 7 ตัว
    await registerPage.submit();

    await registerPage.expectErrorMessage('Invalid password policy');
  });

  test('TC-SEC-002: Verify password exact minimum boundary (8 chars)', async ({ page }) => {
    // MOCK API return HTTP 201 Success
    await page.route('https://mock-api.com/auth/register', route => {
    route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ userId: 101, message: 'Registration successful' })
    });
    });

    // register
    await registerPage.fillRegistrationForm('John', 'sec01@test.com', '0812345678', 'Valid123'); // 8 ตัว
    await registerPage.submit();

    await registerPage.expectSuccessMessage('Registration successful');
  });

  test('TC-SEC-003: Verify password exact maximum boundary (20 chars)', async ({ page }) => {
    // MOCK API return HTTP 201 Success
    await page.route('https://mock-api.com/auth/register', route => {
    route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ userId: 102, message: 'Registration successful' })
    });
    });

    // register
    await registerPage.fillRegistrationForm('John', 'sec02@test.com', '0812345678', 'Valid12345678901234'); // 20 ตัว
    await registerPage.submit();

    await registerPage.expectSuccessMessage('Registration successful');
  });

  test('TC-SEC-004: Verify password above maximum boundary (21 chars)', async ({ page }) => {
    // MOCK API return HTTP 400 Failed
    await page.route('https://mock-api.com/auth/register', route => {
    route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid password policy' })
    });
    });

    // register
    await registerPage.fillRegistrationForm('John', 'sec02@test.com', '0812345678', 'Valid123456789012345'); // 21 ตัว
    await registerPage.submit();

    await registerPage.expectErrorMessage('Invalid password policy');
  });

  test('TC-SEC-005: Verify Registration rejects passwords lacking complexity', async ({ page }) => {
    // MOCK API return HTTP 400 Failed
    await page.route('https://mock-api.com/auth/register', route => {
    route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password must contain at least 1 uppercase and 1 number' })
    });
    });

    // register No Uppercase
    await registerPage.fillRegistrationForm('John', 'sec03@test.com', '0812345678', 'password123');
    await registerPage.submit();
    
    await registerPage.expectErrorMessage('Password must contain at least 1 uppercase and 1 number');

    // MOCK API return HTTP 400 Failed
    await page.route('https://mock-api.com/auth/register', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password must contain at least 1 uppercase and 1 number' })
      });
    });

    // register No Number
    await registerPage.fillRegistrationForm('John', 'sec03@test.com', '0812345678', 'Password');
    await registerPage.submit();
    
    await registerPage.expectErrorMessage('Password must contain at least 1 uppercase and 1 number');
  });
});

test.describe('Security Test: Login Attempt Limitation (Mocked API)', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    
    await loginPage.goto();
  });

  test('TC-SEC-006: Verify account is locked after 5 consecutive failed login attempts', async ({ page }) => {
    const targetEmail = 'john@email.com';
    const wrongPassword = 'WrongPassword';
    const correctPassword = 'Password123';

    // Incorrect Password  time
    for (let i = 1; i <= 5; i++) {
      await loginPage.login(targetEmail, wrongPassword);
      
      if (i < 5) {
        await loginPage.expectErrorMessage(`Invalid credentials. Attempt ${i}/5`);
      } else {
        // incorrect 5 time lock user
        await loginPage.expectErrorMessage('Account locked due to 5 failed attempts. Try again in 15 minutes.');
      }
    }

    // correct password should cannot login
    await loginPage.login(targetEmail, correctPassword);

    await loginPage.expectErrorMessage('Account locked due to 5 failed attempts. Try again in 15 minutes.');
    
    // Not have success
    await expect(loginPage.successMessage).toBeHidden();
  });
});