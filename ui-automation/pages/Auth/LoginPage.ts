import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.alert-error');
    this.successMessage = page.locator('.alert-success');
  }

  async goto() {
    const filePath = path.resolve('mocks/login.html');
    const csvPath = path.resolve('data/users.csv');

    await this.page.route('https://mock-api.com/data/user.csv', route => {
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      
      route.fulfill({
        status: 200,
        contentType: 'text/csv',
        body: csvContent
      });
    });

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