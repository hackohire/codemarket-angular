import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";

export class CustomRouteReuseStategy implements RouteReuseStrategy {

  handlers: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data.hasOwnProperty('noReuse') ? !route.data.noReuse : false;
  }

  store(route: ActivatedRouteSnapshot, handle: {}): void {
      if (route.data.hasOwnProperty('noReuse') && !route.data.noReuse) {

      } else {
        this.handlers[route.routeConfig.path] = handle;
      }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
  }

  retrieve(route: ActivatedRouteSnapshot): {} {
    if (!route.routeConfig) return null;
    return this.handlers[route.routeConfig.path];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig && (future.data.hasOwnProperty('noReuse') ? !future.data.noReuse : true);
  }

}