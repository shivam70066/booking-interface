import { bootstrapApplication, createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { createCustomElement } from '@angular/elements';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

  (async () => {
    const app = createApplication(appConfig);
    const PopupElement = createCustomElement(AppComponent, {
      injector: (await app).injector
    });
  
    customElements.define('bedy-popup', PopupElement);
  
  })();