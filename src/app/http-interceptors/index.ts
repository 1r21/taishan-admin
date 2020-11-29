import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DefaultInterceptor } from './default-intercepter';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
];
