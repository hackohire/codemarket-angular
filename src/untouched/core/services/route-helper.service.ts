import { Injectable } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { filter, map, tap, mapTo } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SeoService } from './seo.service';

export declare enum MetaTagAttr {
  name = "name",
  property = "property"
}

export interface MetaTag {
  attr: MetaTagAttr;
  attrValue: string;
  value?: string;
}

export interface JsonLd {
  [param: string]: string | Object;
}

export interface SeoSocialShareData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  section?: string;
  published?: string;
  modified?: string;
}

/** Route Helper Service which listens to route events and is currently used for SEO */
@Injectable({
  providedIn: 'root',
})
export class RouteHelperService {

  private routes = [, '/', '/'];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly viewportScroller: ViewportScroller,
    private seoService: SeoService

  ) {
    this.setupRouting();
  }

  keyboardNavigate(key: string | number) {
    if (this.routes[key]) {
      this.router.navigateByUrl(this.routes[key]);
    }
  }

  private setupRouting() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd), /** filter when the navigation ends */
      tap(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      }),
      mapTo(this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary' || route.outlet === 'main'),
    ).subscribe((route: ActivatedRoute) => {
      const data: any = route.snapshot.data;
      if ((data && data['seo']) && data['setPostMeta']) {
        this.seoService.setMetaTagsForPost(data['seo'])
      } else {
        this.seoService.setMetaTagsFromData(null);
      }
    });
  }

}