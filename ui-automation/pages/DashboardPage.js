class DashboardPage {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
    }

    async goto() {
        // Navigates to the base URL defined in your config
        await this.page.goto('/dashboard'); 
    }

    async checkInReservation(reservationId) {
        // Click the Check-in button for the specified reservation ID
        await this.page.click(`tr:has-text("${reservationId}") button.check-in`);
    }
}

module.exports = { DashboardPage };