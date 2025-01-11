import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { GlobalModule } from './../../modules/global/global.module';

@Directive({
  selector: '[appShowForRoles]'
})
export class ShowForRolesDirective implements OnInit, OnDestroy {
  @Input('appShowForRoles') allowedRoles?: string[];

  constructor(
    private global: GlobalModule,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) { }

  ngOnInit(): void {
    const permission = !this.global.getUserInfo().roles.every(role => !this.allowedRoles?.includes(role));

    if (permission) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainerRef.clear();
    }
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}
