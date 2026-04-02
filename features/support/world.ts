import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page } from 'playwright';

export class CustomWorld extends World {
  browser!: Browser;
  page!: Page;
  readonly baseUrl = 'http://localhost:3002';

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
