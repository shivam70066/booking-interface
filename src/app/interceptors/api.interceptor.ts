import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const newReq = req.clone({
    setHeaders: {
      'Current_version': '9'
    }
  })
  return next(newReq);
};
