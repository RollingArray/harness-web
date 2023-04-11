/**
 * © Collins Aerospace https://www.collinsaerospace.com/
 *
 * main.ts is the entry point for the Angular application. 
 * It's the file that is responsible for bootstrapping the application and initializing the runtime environment.
 *
 * @summary short description for the file
 * @author Ranjoy Sen <ranjoy.sen@collins.com>
 *
 * Created at     : 2023-04-01 09:42:16 
 * Last modified  : 2023-04-01 09:49:47
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
