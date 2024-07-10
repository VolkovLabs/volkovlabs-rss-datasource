import { test, expect } from '@grafana/plugin-e2e';

test.describe('RSS datasource', () => {
  test('Check grafana version', async ({ grafanaVersion }) => {
    console.log('Grafana version: ', grafanaVersion);
    expect(grafanaVersion).toEqual(grafanaVersion);
  });

  test('Should display a Dynamic Text with Data Source', async ({ gotoDashboardPage, dashboardPage, page }) => {
    /**
     * Go To panels dashboard panels.json
     * return dashboardPage
     */
    await gotoDashboardPage({ uid: 'O4tc_E6Gz' });

    /**
     * Await content load
     */
    await page.waitForTimeout(1000);

    /**
     * Find panel by title with data
     * Should be visible
     */
    await expect(dashboardPage.getPanelByTitle('Volkov Labs YouTube').locator).toBeVisible();
  });
});
