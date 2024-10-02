import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

import { hmrBootstrap } from "./hmr";

import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NHaF5cWWdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWH1cdnRSRWNcUkB0V0E="
);

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.hmr) {
  if (module["hot"]) {
    hmrBootstrap(module, bootstrap);
  } else {
    console.error("HMR is not enabled for webpack-dev-server!");
    console.log("Are you using the --hmr flag for ng serve?");
  }
} else {
  bootstrap().catch((err) => console.log(err));
}
