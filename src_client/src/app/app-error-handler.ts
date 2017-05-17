import {ErrorHandler, Injectable, Injector} from "@angular/core";
import {ToastyService} from "ng2-toasty";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {
  }

  handleError(error) {
    const toast: ToastyService = this.injector.get(ToastyService);
    const message = error.message ? error.message : error.toString();

    console.log(error);
    toast.error({title: `ERROR: ${message}`, timeout: 0});
  }
}
