import Base from '../Base';
import type Scraper from '..';

const Email = process.env.MICROSOFT_EMAIL as string;
const Password = process.env.MICROSOFT_PASSWORD as string;
const Domain = 'microsoftonline.com';

export default class Microsoft extends Base {
    /** Microsoft domain */
    public Domain = Domain;

    public constructor(scraper: Scraper) {
        super(scraper);
    }

    /** Check whether the scraper has logged into Microsoft */
    public hasLoggedIn(): Promise<boolean> {
        return Promise.resolve(this.scraper.uponline?.isOnCoursePage() ?? false);
    }

    /** Check if the current page is the Microsoft login */
    public isOnLoginPage(): Promise<boolean> {
        return Promise.resolve(this.page.url().includes(`login.${Domain}`));
    }

    /** Attempt to login to the Microsoft */
    public async login(): Promise<boolean> {
        if (await this.hasLoggedIn()) return true;
        if (!(await this.isOnLoginPage())) return false;

        this.log('Attempting to login to Microsoft...');

        // Input the email address
        await this.page.click('[id=i0116]');
        await this.page.keyboard.type(Email);
        await this.page.click('[id=idSIButton9]');
        await this.page.waitForTimeout(3000);

        // Input the password
        await this.page.click('[id=i0118]');
        await this.page.keyboard.type(Password);
        await this.page.click('[id=idSIButton9]');
        await this.page.waitForTimeout(3000);

        // Confirm "stay signined in"
        await this.page.click('[id=KmsiCheckboxField]');
        await this.page.click('[id=idSIButton9]');

        // Ensure the next page has loaded
        await this.page.waitForSelector('[id="ZZZ"]');

        this.log('Logged into Microsoft');

        return true;
    }

    /** Microsoft domain */
    public static Domain = Domain;
}
