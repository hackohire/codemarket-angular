import { NgModule } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { SeoService } from './services/seo.service';

export function serializeJsonLdFactory(doc: Document, seoSerivce: SeoService) {
  const serializeAndInject = () => {
    const script = doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = seoSerivce.toJson();
    doc.head.appendChild(script);
  };
  return serializeAndInject;
}

@NgModule({
  providers: [
    SeoService, {
      provide: BEFORE_APP_SERIALIZED,
      useFactory: serializeJsonLdFactory,
      deps: [DOCUMENT, SeoService],
      multi: true,
    },
  ],
})
export class ServerJsonLdModule {
}