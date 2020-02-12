import { NgModule, EventEmitter } from '@angular/core';
import { CopyClipboardDirective } from './copy-clipboard.directive';

@NgModule({
  imports: [],
  exports: [CopyClipboardDirective],
  declarations: [CopyClipboardDirective],
  providers: []
})
export class CopyClipboardModule {

  copied: EventEmitter<string> = new EventEmitter<string>();

  constructor(private copy: CopyClipboardDirective) {
    this.copy.copied.subscribe(pay => {
      this.copied.emit(pay);
      console.log('CopyClipboardDirective:: ' + pay);
    });
  }
}
