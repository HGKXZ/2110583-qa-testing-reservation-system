import { test, expect } from '@playwright/test';
import { testData } from '../data/settingData';
import { LoginPage } from '../pages/LoginPage';
import { SettingPage } from '../pages/SettingPage';
import { settings } from 'node:cluster';

test.describe('View Availability', () => {

    test.beforeEach(async ({ page }) => {
        const LoginPage = new LoginPage(page);
        await LoginPage.goto();
        await LoginPage.adminLogin();
        
        const SettingPage = new SettingPage(LoginPage);
        await SettingPage.goto(); 
    });

    //TC-015-001
    test('Update basic restaurant info', async ({ page }) => {
        const data = testData.basicInfo;
        await SettingPage.changeBasicinfo(
            data.restaurantName,   
            data.telephone
        );

        const confirmationMsg = page.locator('.confirmation-msg');
        await expect(confirmationMsg).toHaveText('Settings Updated Successfully');
    });

    //TC-015-002
    test('Update Operating Hours (Cross-midnight)', async ({ page }) => {
        const data = testData.openingHours;
        await SettingPage.changeOpeningHours(
            data.startTime,   
            data.endTime
        );

        const startTimeRow = page.locator('#start-time');
        const endTimeRow = page.locator('#end-time');
        await expect(startTimeRow).toHaveValue(data.startTime);
        await expect(endTimeRow).toHaveValue(data.endTime);

        const errorMessage = page.locator('.error-message');
        await expect(errorMessage).not.toBeVisible();
    });     

});  