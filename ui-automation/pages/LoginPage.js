import { testData } from '../data/loginData';

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Selectors mapped from your mock UI 
    this.fullNameInput = page.getByRole('textbox', { name: 'Full Name' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.emailInput = page.getByRole('textbox', { name: 'email' });
    this.passwordInput = page.getByRole('textbox', { name: 'password' });

    this.registerButton = page.locator('button:has-text("Register")');
    this.loginButton = page.locator('button:has-text("Log In")');
    this.userInfo = page.locator('#user-info');
  }

  async goto() {
    // Navigates to the base URL defined in your config
    await this.page.goto('/login'); 
  }

  async register(fullName, phone, email, password) {
    await this.fullNameInput.fill(fullName);
    await this.phoneInput.fill(phone);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }

  async login(
    email = testData.validUser.email, 
    password = testData.validUser.password
  ) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async staffLogin(
    email = testData.staff.email, 
    password = testData.staff.password
  ) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

   async adminLogin(
    email = testData.admin.email, 
    password = testData.admin.password
  ) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };