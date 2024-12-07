import { NgModule } from "@angular/core";
import { RouterModule  } from "@angular/router";

// routes imported
import { globalRoutes } from "./modules/global/global.routing";
import { workCenterRoutes } from "./modules/workCenter/workCenter.routing";
import { officeRoutes } from "./modules/office/office.routing";
import { policyRoutes } from "./modules/policy/policy.routing";

@NgModule({
  imports: [RouterModule.forChild([
    ...globalRoutes,
    ...workCenterRoutes,
    ...officeRoutes,
    ...policyRoutes
  ])],
  exports: [RouterModule]
})

export class AppRouterModule { }
