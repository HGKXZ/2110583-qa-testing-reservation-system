import { test, expect } from '@playwright/test';
import { testData } from '../data/reservationData';
import { LoginPage } from '../pages/LoginPage';
import { ReservationPage } from '../pages/ReservationPage';

test.describe('View Availability', () => {

    test.beforeEach(async ({ page }) => {
        const LoginPage = new LoginPage(page);
        await LoginPage.goto();
        await LoginPage.login();

        const ReservationPage = new ReservationPage(LoginPage);
        await ReservationPage.goto();
    });

    //TC-005-001
    test('View availability for a valid future date and time', async ({ page }) => {
        const data = testData.validData;
        
        await ReservationPage.searchTable(
            data.date,
            data.time,
            data.guests
        );

        const resultGrid = page.locator('.avail-grid');
        await expect(resultGrid).toBeVisible();

        const tableCards = page.locator('.table-card');
        await expect(tableCards).not.toHaveCount(0);
    });

    //TC-005-002
    test('Guest count at minimum boundary', async ({ page }) => {
        const data = testData.validData;
        const minGuest = testData.MinGuestsData;
        
        await ReservationPage.searchTable(
            data.date,
            data.time,
            data.minGuest
        );

        const resultGrid = page.locator('.avail-grid');
        await expect(resultGrid).toBeVisible();

        const tableCards = page.locator('.table-card');
        await expect(tableCards).not.toHaveCount(0);
    });

    //TC-005-003
    test('Guest count at maximum boundary', async ({ page }) => {
        const data = testData.validData;
        const maxGuest = testData.maxGuestsData;
        
        await ReservationPage.searchTable(
            data.date,
            data.time,
            data.maxGuest
        );

        const availableTables = page.locator('.table-card:has(.badge-green)');
        const count = await availableTables.count();
        
        for (let i = 0; i < count; i++) {
            const capacityText = await availableTables.nth(i).locator('.tc-cap').innerText();
            const capacity = parseInt(capacityText.match(/\d+/)[0]);

            expect(capacity).toBeGreaterThanOrEqual(maxGuest);
        }
    });

    //TC-005-004
    test('Guest count exceeds maximum', async ({ page }) => {
        const data = testData.validData;
        const exceedGuest = testData.ExceedMaxGuestsData;
        
        await ReservationPage.searchTable(
            data.date,
            data.time,
            data.exceedGuest
        );

        const errorBox = page.locator('.error-message'); 
        await expect(errorBox).toBeVisible();
        await expect(errorBox).toHaveText('Maximum 10 guests allowed per table.');
    });

    //TC-005-005
    test('Search for a past date', async ({ page }) => {
        const validData = testData.validData;
        const invalidData = testData.InvalidData;
        
        await ReservationPage.searchTable(
            invalidData.date,
            validData.time,
            validData.guests
        );

        const errorBox = page.locator('.error-message'); 
        await expect(errorBox).toBeVisible();
        await expect(errorBox).toHaveText('Must select a future date.');
    });

    //TC-005-006
    test('Search when all tables are fully booked', async ({ page }) => {
        const data = testData.validData;
        
        await ReservationPage.searchTable(
            data.date,
            data.time,
            data.guests
        );

        const errorBox = page.locator('.error-message'); 
        await expect(errorBox).toBeVisible();
        await expect(errorBox).toHaveText('No tables available for this time.');
    });
});  

test.describe('Make Reservation', () => {

    test.beforeEach(async ({ page }) => {
        const LoginPage = new LoginPage(page);
        await LoginPage.goto();
        await LoginPage.login();

        const ReservationPage = new ReservationPage(LoginPage);
        await ReservationPage.goto();
    });

    //TC-006-001 & TC-007-001
    test('Search when all tables are fully booked', async ({ page }) => {
        const data = testData.validData;
        
        await ReservationPage.reserveTable(
            data.date,
            data.time,
            data.guests
        );

        const reservationId = page.locator('.confirm-id');
        await expect(reservationId).toContainText(/#RES-\d+/); 

        const confirmationMsg = page.locator('.confirm-sub');
        await expect(confirmationMsg).toHaveText('Reservation Created Successfully');
    });    

    //TC-013-001
    test('Book the same table in a different time slot', async ({ page }) => {
        const data = testData.validData;
        const thisSlot = testData.thisSlot;
        const nextSlot = testData.nextSlot;
        
        await ReservationPage.reserveTable(
            data.date,
            data.thisSlot,
            data.guests
        );

        await ReservationPage.goto();

        await ReservationPage.reserveTable(
            data.date,
            data.nextSlot,
            data.guests
        );

        const reservationId = page.locator('.confirm-id');
        await expect(reservationId).toContainText(/#RES-\d+/); 

        const confirmationMsg = page.locator('.confirm-sub');
        await expect(confirmationMsg).toHaveText('Reservation Created Successfully');        
    });    

    //TC-013-002
    test('Book the same table for the same time slot', async ({ page }) => {
        const data = testData.validData;
        const thisSlot = testData.thisSlot;
        const nextSlot = testData.nextSlot;
        
        await ReservationPage.reserveTable(
            data.date,
            data.thisSlot,
            data.guests
        );

        await ReservationPage.goto();

        await ReservationPage.reserveTable(
            data.date,
            data.thisSlot,
            data.guests
        );

        const errorBox = page.locator('.error-message'); 
        await expect(errorBox).toBeVisible();
        await expect(errorBox).toHaveText('This table is already reserved for the selected time.');    
    });
});

test.describe('Manual Reservation', () => {

    test.beforeEach(async ({ page }) => {
        const LoginPage = new LoginPage(page);
        await LoginPage.goto();
        await LoginPage.staffLogin();

        const ReservationPage = new ReservationPage(LoginPage);
        await ReservationPage.goto();
    });

    //TC-014-001
    test('Standard Walk-in Creation', async ({ page }) => {
        const data = testData.manualReservationData;
        
        await ReservationPage.reserveTable(
            data.table,
            data.guests
        );

        const tableRow = page.locator('tr', { hasText: data.table });
        const statusBadge = tableRow.locator('.badge');
        
        await expect(statusBadge).toHaveText('Occupied');
        });    
});