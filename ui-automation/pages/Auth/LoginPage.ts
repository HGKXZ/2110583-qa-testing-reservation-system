import { Page, Locator, expect } from '@playwright/test';
import path from 'path';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // เปลี่ยนมาใช้ data-testid เพื่อความเสถียรสูงสุด
    this.emailInput = page.getByTestId('input-email');
    this.passwordInput = page.getByTestId('input-password');
    this.loginButton = page.getByTestId('btn-login');
    this.errorMessage = page.getByTestId('error-message');
    this.successMessage = page.getByTestId('success-message');
  }

  async goto() {
    const filePath = path.resolve('mocks/login.html');
    await this.page.goto(`file://${filePath}`);
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectSuccessMessage(message: string) {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText(message);
  }
}