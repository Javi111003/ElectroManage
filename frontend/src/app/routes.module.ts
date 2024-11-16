import { NgModule } from "@angular/core";
import { RouterModule  } from "@angular/router";

// routes imported
import { globalRoutes } from "./modules/global/global.routing";
import { workCenterRoutes } from "./modules/workCenter/workCenter.routing";
import { officeRoutes } from "./modules/office/office.routing";
import { equipmentRoutes } from "./modules/office/options/equipment/equipment.routing";
import { totalConsumptionRoutes } from "./modules/workCenter/options/total-consumption/total-consumption.routing";
import { avgConsumptionRoutes } from "./modules/workCenter/options/avg-consumption/avg-consumption.routing";
import { policyRoutes } from "./modules/workCenter/options/policy/policy.routing";

@NgModule({
  imports: [RouterModule.forChild([
    ...globalRoutes,
    ...workCenterRoutes,
    ...officeRoutes,
    ...equipmentRoutes,
    ...totalConsumptionRoutes,
    ...avgConsumptionRoutes,
    ...policyRoutes
  ])],
  exports: [RouterModule]
})

export class AppRouterModule { }
