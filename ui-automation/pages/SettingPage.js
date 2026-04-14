class SettingPage {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;

        this.name = page.locator('#restaurant-name');
        this.telephone = page.locator('#telephone');
        this.startTime = page.locator('#start-time');
        this.endTime = page.locator('#end-time');
        this.saveButton = page.locator('#save-settings');
    }

    async goto() {
        // Navigates to the base URL defined in your config
        await this.page.goto('/settings'); 
    }

    async changeBasicinfo(name, telephone) {
        await this.name.fill(name);
        await this.telephone.fill(telephone);
        await this.saveButton.click();
    }

    async changeOpeningHours(startTime, endTime) {
        await this.startTime.fill(startTime);
        await this.endTime.fill(endTime);
        await this.saveButton.click();
    }
}

module.exports = { SettingPage };