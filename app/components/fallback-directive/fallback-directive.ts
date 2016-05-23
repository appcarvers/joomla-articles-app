import {Directive, ElementRef, Input} from 'angular2/core';

/*
  Generated class for the FallbackDirective directive.

  See https://angular.io/docs/ts/latest/api/core/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
    selector: '[fallbackSrc]', // Attribute selector
    host:{'(error)':'onImageLoadError()'}
})
export class FallbackDirective {
    //@Input() fallbackSrc: string;
    ElemAttr: ElementRef
    constructor(private el: ElementRef) {
        this.ElemAttr = el;
    }
    onImageLoadError(){
        this.ElemAttr.nativeElement.src="img/fallbackimage.png";
        
    }
}
