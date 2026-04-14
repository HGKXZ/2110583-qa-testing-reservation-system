import { test, expect } from '@playwright/test';
import { testData } from '../data/reservationData';
import { LoginPage } from '../pages/LoginPage';
import { ReservationPage } from '../pages/ReservationPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('View Availability', () => {

    test.beforeEach(async ({ page }) => {
        const LoginPage = new LoginPage(page);
        await LoginPage.goto();
        await LoginPage.login();

        // Navigate to Reservation Page
        const ReservationPage = new ReservationPage(LoginPage);
        await ReservationPage.goto();

        // Pre-book all tables for the test slot to set up the fully booked scenario
        const data = testData.validData;
        await ReservationPage.reserveTable(
            data.date,
            data.time,
            data.guests
        );

        const dashboardPage = new DashboardPage(page);
        DashboardPage.goto();
    });

    //TC-010-001
    test('No cancel at 14 mins 59 secs', async ({ page }) => {
        const bva_lateCancel_14m59s = testData.bva_lateCancel_14m59s;
        await page.clock.setFixedTime(new Date(bva_lateCancel_14m59s));
        
        const resRow = page.locator('tr', { hasText: '18:00' });
        await expect(resRow.locator('.badge')).toHaveText('Confirmed');
    });

    //TC-010-002
    test('Auto-cancel exactly at 15 mins', async ({ page }) => {
        const bva_lateCancel_15m00s = testData.bva_lateCancel_15m00s;
        await page.clock.setFixedTime(new Date(bva_lateCancel_15m00s));
        
        const resRow = page.locator('tr', { hasText: '18:00' });
        await expect(resRow.locator('.badge')).toHaveText('Cancelled');
    });

    //TC-010-004
    test('No auto-cancel if Customer already Checked-in', async ({ page }) => {
        const checkInTime = testData.checkInTime_5m;
        const checkTime = testData.checkInTime_6m;

        await page.clock.setFixedTime(new Date(checkInTime));
        await DashboardPage.checkInReservation(testData.reservationId);

        await page.clock.setFixedTime(new Date(checkTime));
        const resRow = page.locator('tr', { hasText: '18:00' });
        await expect(resRow.locator('.badge')).toHaveText('Occupied');
    });
});  