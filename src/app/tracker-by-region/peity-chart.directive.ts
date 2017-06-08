import { Directive, ElementRef, HostListener} from '@angular/core';
declare var jQuery:any;
@Directive({
  selector: '[appPeityChart]'
})
export class PeityChartDirective {

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    console.log(this.el.nativeElement);
  }
  ngOnInit()    { 
    //console.log('On init');
    //console.log(this.el.nativeElement);
   // jQuery(this.el.nativeElement).peity('donut');
  }
  ngAfterViewInit() {
    //console.log(this.el.nativeElement);
     jQuery(this.el.nativeElement).peity('donut');
  }
   ngAfterViewChecked() {
    
   }
 
   private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
