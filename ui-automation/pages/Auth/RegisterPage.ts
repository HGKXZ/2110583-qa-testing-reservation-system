import { Page, Locator, expect } from '@playwright/test';
import path from 'path';

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('#name'); 
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.passwordInput = page.locator('#password');
    this.registerButton = page.locator('button[type="submit"]');
    
    this.errorMessage = page.locator('.alert-error'); 
    this.successMessage = page.locator('.alert-success'); 
  }

  async goto() {
    const filePath = path.resolve('mocks/register.html');
    await this.page.goto(`file://${filePath}`);
  }

  async fillRegistrationForm(name: string, email: string, phone: string, pass: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.passwordInput.fill(pass);
  }

  async submit() {
    await this.registerButton.click();
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