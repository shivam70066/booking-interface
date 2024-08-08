import { Directive, ElementRef, Renderer2, OnInit, AfterViewInit, Inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Directive({
  selector: '[appAssetBaseUrl]',
  standalone: true
})
export class AssetBaseUrlDirective implements OnInit, AfterViewInit {
  private observer!: MutationObserver;
  private assetBaseHref:string = environment.ASSESTS_BASE_URL;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.updateAssetUrls(this.el.nativeElement);
  }

  ngAfterViewInit(): void {
    this.observeMutations();
  }

  private updateAssetUrls(element: HTMLElement): void {
    const assets = element.querySelectorAll('[src], [href]');
    assets.forEach((asset: Element) => {
      const attr = asset.hasAttribute('src') ? 'src' : 'href';
      const url = asset.getAttribute(attr);
      if (url && !url.startsWith('http')) {
        asset.setAttribute(attr, `${this.assetBaseHref}${url}`);
      }
    });
  }

  private observeMutations(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.updateAssetUrls(this.el.nativeElement);
        }
      });
    });
    this.observer.observe(this.el.nativeElement, { childList: true, subtree: true });
  }
}
