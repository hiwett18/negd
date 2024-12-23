import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Bootstrap the Angular application.
 * This initializes the application using the provided appConfig.
 */
const bootstrap = async () => {
  try {
    console.log('Bootstrapping Angular application...');

    // Bootstrap the application using the configuration from appConfig
    await bootstrapApplication(AppComponent, appConfig);

    console.log('Angular application bootstrapped successfully.');
  } catch (err) {
    // Log any errors that occur during the bootstrapping process
    console.error('Error during Angular bootstrap:', err);
  }
};

// Call the bootstrap function
bootstrap();
