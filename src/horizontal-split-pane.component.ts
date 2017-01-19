import { Component, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SplitPaneComponent } from './split-pane.component'
import { PositionService } from './position.service'

@Component({
  selector: 'horizontal-split-pane',
  styles: [`
    .h-outer {
      height: 100%;
      width: 100%;
      display: flex;
      flex-flow: column;
    }

    .upper-component {
      height: calc(50% - 4px);
    }

    .lower-component {
      height: calc(50% - 4px);
    }
  `],
  template: `
  <div #outer class="h-outer">
    <div #primaryComponent class="upper-component">
      <ng-content select=".split-pane-content-primary"></ng-content>
    </div>
    <horizontal-split-separator #separator (notifyWillChangeSize)="notifyWillChangeSize($event)"></horizontal-split-separator>
    <div #secondaryComponent class="lower-component">
      <ng-content select=".split-pane-content-secondary"></ng-content>
    </div>
  </div>
  `,
})
export class HorizontalSplitPaneComponent extends SplitPaneComponent {

  @ViewChild('outer') protected outerContainer: ElementRef;
  @Input() test: number;

  protected getTotalSize(): number {
    return this.outerContainer.nativeElement.offsetHeight;
  }

  protected getPrimarySize(): number {
    return this.primaryComponent.nativeElement.offsetHeight;
  }

  protected getSecondarySize(): number {
    return this.secondaryComponent.nativeElement.offsetHeight;
  }

  protected dividerPosition(size: number) {
    const sizePct = (size / this.getTotalSize()) * 100.0;
    this.primaryComponent.nativeElement.style.height = sizePct + "%";
    this.secondaryComponent.nativeElement.style.height = "calc(" + (100 - sizePct) + "% - 8px)";
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
      if (this.isResizing) {
        let coords = PositionService.offset(this.primaryComponent);
        this.applySizeChange(event.pageY - coords.top);
      }
      return false;
    }
}
