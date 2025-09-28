import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy,} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly appName = 'np-timetracker';

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let routeTitle = this.buildTitle(snapshot);
    // If empty, traverse manually and pick first available data.title from deepest to root
    if (!routeTitle) {
      const titles: string[] = [];
      let node: ActivatedRouteSnapshot | null = snapshot.root;
      while (node) {
        const t = node.data?.['title'];
        if (t) titles.push(t);
        node = node.firstChild ?? null;
      }
      routeTitle = titles.pop() ?? '';
    }
    const fullTitle = routeTitle
      ? `${routeTitle} | ${this.appName}`
      : this.appName;
    this.title.setTitle(fullTitle);
  }
}
