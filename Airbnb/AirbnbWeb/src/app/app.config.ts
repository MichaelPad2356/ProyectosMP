import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimationsAsync(), provideAnimationsAsync(), 
     provideFirebaseApp(() => initializeApp({"projectId":"airbnbfinal-fe212","appId":"1:1007996376875:web:0e036d949b142b2562d76e","storageBucket":"airbnbfinal-fe212.appspot.com","apiKey":"AIzaSyCGYaYAclr6hcLM8zbqZNVJoktuKNgnigU","authDomain":"airbnbfinal-fe212.firebaseapp.com","messagingSenderId":"1007996376875"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), provideAnimationsAsync()]
};
