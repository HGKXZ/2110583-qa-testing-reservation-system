class ReservationPage {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        // Selectors mapped from your mock UI 
        
        this.dateInput = page.locator('#Date')
        this.timeInput = page.locator('#Time')
        this.guestInput = page.getByRole('textbox', { name: 'Number of guests' });

        this.searchButton = page.locator('button:has-text("Search ->)');
        this.bookButton = page.locator('button:has-text("Proceed to Book")');
    }

    async goto() {
        // Navigates to the base URL defined in your config
        await this.page.goto('/reservation'); 
    }

    async searchTable(date, time, guests) {
        const formattedDate = date.split('-')
        await page.locator('.react-datepicker__year-select').selectOption(formattedDate[0]);
        await page.locator('.react-datepicker__month-select').selectOption(formattedDate[1]);
        await page.getByRole('gridcell', { name: `${formattedDate[1]} ${formattedDate[2]}, ${formattedDate[0]}` }).click();

        const formattedTime = time.split(':')
        await page.locator('.react-timepicker__hour-select').selectOption(formattedTime[0]);
        await page.locator('.react-timepicker__minute-select').selectOption(formattedTime[1]);
        await page.getByRole('gridcell', { name: `${formattedTime[0]}:${formattedTime[1]}` }).click();

        await this.guestInput.fill(guests);
        await this.searchButton.click();
    }

    async reserveTable(date, time, guests) {
        searchTable(date, time, guests);

        const resultGrid = page.locator('.avail-grid');
        await page.resultGrid.locator('.table-card').first().click();
        await this.bookButton.click();
    }

}

module.exports = { ReservationPage };