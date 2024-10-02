import { NgModule } from "@angular/core";
import {
  DragAndDropService,
  MonthAgendaService,
  ResizeService,
  ScheduleModule,
  TimelineMonthService,
  TimelineViewsService,
} from "@syncfusion/ej2-angular-schedule";
import {
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
} from "@syncfusion/ej2-angular-schedule";
import { DynamicScheduleComponent } from "./dynamic-schedule.component";
import { CommonModule } from "@angular/common";
import { DynamicModule } from "../dynamic.module";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { CommonCustomModule } from "app/common/common-custom.module";

@NgModule({
  declarations: [DynamicScheduleComponent],
  imports: [
    CommonModule,
    ScheduleModule,
    DynamicModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    CommonCustomModule
  ],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
    TimelineViewsService,
    TimelineMonthService,
    ResizeService,
    DragAndDropService,
  ],
  exports: [DynamicScheduleComponent],
  entryComponents: [DynamicScheduleComponent],
})
export class DynamicSchedulerModule {}
