import { NgModule } from "@angular/core";
import { RouterModule  } from "@angular/router";
import { globalRoutes } from "./modules/global/global.routing";

@NgModule({
  imports: [RouterModule.forChild([
    ...globalRoutes
  ])],
  exports: [RouterModule]
})

export class AppRouterModule { }
