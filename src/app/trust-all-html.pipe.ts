import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'trustAllHTML'
})
export class TrustAllHTMLPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer){}  

   transform(v: string) : SafeHtml {
      return this._sanitizer.bypassSecurityTrustHtml(v); 
   } 


}
