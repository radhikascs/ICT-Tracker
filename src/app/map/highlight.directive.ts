import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[legendHighlight]'
})
export class HighlightDirective {

 @Output() filterMap :EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) { }

  @Input() defaultColor: string;
  @Input('legendHighlight') highlightColor: string;


   @HostListener('click') click() {
     this.filterMap.emit();
  }

  highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
