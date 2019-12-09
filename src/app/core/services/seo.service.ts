import { Injectable, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

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

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private jsonLd: JsonLd | JsonLd[];

  constructor(
    private metaService: Meta,
    private titleService: Title,
    @Optional() @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(DOCUMENT) private readonly document,
  ) { }

  /** Set Default Meta Tags or Based On Data */
  public setMetaTagsFromData(seo) {
    this.setTwitterCard('summary_large_image');
    this.setTwitterSiteCreator('codemarket');
    if (seo) {
      const description: any = seo.description && seo.description.length ? seo.description.find(d => d.type === 'header' || d.type === 'paragraph') : null;

      const jsonLd = this.getjsonDLObject('Website', {
        name: seo.name,
        url: isPlatformBrowser(this.platformId) ? window.location.href : '',
      });
      this.setJsonLDData(jsonLd);

      const seoSocialShareData: SeoSocialShareData = {
        title: seo.name,
        description: description && description.data.text ? description.data.text : '',
        image: 'https://www.codemarket.io/assets/images/logo_qugbvk_c_scalew_282.png',
        author: seo.createdBy.name,
        url: isPlatformBrowser(this.platformId) ? window.location.href : '',
        type: 'article',
      };
      this.setData(seoSocialShareData);
    } else {
      const jsonLd = this.getjsonDLObject('Website', {
        name: 'Codemarket',
        url: isPlatformBrowser(this.platformId) ? window.location.href : ''
      });
      this.setJsonLDData(jsonLd);
      const seoSocialShareData: SeoSocialShareData = {
        title: 'Innovation made Accessible & Affordable for Everyone',
        description: 'Building Tech Skills, Business Skills & Leadership Skills for  Career Growth',
        image: 'https://www.codemarket.io/assets/images/cm.gif',
        url: isPlatformBrowser(this.platformId) ? window.location.href : '',
        type: 'website',
        author: 'Sumit Vekariya'
      };
      this.setData(seoSocialShareData);
    }
  }

    /** Set Meta Tags particulary for Post  */
    setMetaTagsForPost(p) {
      const description: any = p.description && p.description.length ? p.description.find(d => d.type === 'header' || d.type === 'paragraph') : null;
      const image: any = p.description && p.description.length ? p.description.find(d => d.type === 'image') : '';
      this.setTwitterCard('summary_large_image');
      this.setTwitterSiteCreator('codemarket');
      const jsonLd = this.getjsonDLObject('BlogPosting', {
        name: p.name,
        url: isPlatformBrowser(this.platformId) ? window.location.href : '',
        author: this.getjsonDLObject('Person', {
          name: p.createdBy.name,
        }, undefined),
        publisher: this.getjsonDLObject('Person', {
          name: p.createdBy.name,
        }, undefined),
        headline: p.name,
        description: description && description.data.text ? description : p.name,
        image: image && image.data.file.url ? image.data.file.url : 'https://www.codemarket.io/assets/images/logo_qugbvk_c_scalew_282.png',
        // dateCreated: p.createdAt,
        // datePublished: p.createdAt,
        // dateModified: p.updatedAt,
      });
      this.setJsonLDData(jsonLd);
      const seoData = {
        title: p.name,
        description: description && description.data.text ? description : p.name,
        image: image && image.data.file.url ? image.data.file.url : 'https://www.codemarket.io/assets/images/logo_qugbvk_c_scalew_282.png',
        url: isPlatformBrowser(this.platformId) ? window.location.href : '',
        type: 'article',
        author: p.createdBy.name,
        // published: p.createdAt,
        // modified: p.updatedAt,
      };
      this.setData(seoData);
    }

  public setData(data: SeoSocialShareData): void {
    this.setTitle(data.title);
    this.setMetaDescription(data.description);
    this.setUrl(data.url);
    this.setImage(data.image);
    this.setPublished(data.published);
    this.setModified(data.modified);
    this.setAuthor(data.author);
    this.setSection(data.section);
    this.setType(data.type);
  }

  /** JSON LD */

  setJsonLDData(data: JsonLd | JsonLd[]) {
    this.jsonLd = data;
    this.injectBrowser();
  }

  toJson() {
    return JSON.stringify(this.jsonLd);
  }

  getjsonDLObject(type: string, rawData?: JsonLd, context = 'http://schema.org'): JsonLd {
    let object: JsonLd = {
      '@type': type,
    };
    if (context) {
      object = {
        '@context': context,
        ...object,
      };
    }
    if (rawData) {
      object = {
        ...object,
        ...rawData,
      };
    }
    return object;
  }

  private injectBrowser() {
    if (this.platformId && isPlatformBrowser(this.platformId)) {
      let ldJsonScriptTag = this.document.head.querySelector(`script[type='application/ld+json']`);
      if (ldJsonScriptTag) {
        ldJsonScriptTag.textContent = this.toJson();
      } else {
        ldJsonScriptTag = this.document.createElement('script');
        ldJsonScriptTag.setAttribute('type', 'application/ld+json');
        ldJsonScriptTag.textContent = this.toJson();
        this.document.head.appendChild(ldJsonScriptTag);
      }
    }
  }

  /** SEO SOCIAL SHARE */

  public setSection(newSection?: string): void {
    if (newSection && newSection.length) {
      this.metaService.updateTag({ name: 'article:section', content: newSection });
    } else {
      this.metaService.removeTag(`name='article:section'`);
    }
  }

  public setTwitterSiteCreator(site?: string): void {
    if (site && site.length) {
      this.metaService.updateTag({ name: 'twitter:site', content: site });
      this.metaService.updateTag({ name: 'twitter:creator', content: site });
    } else {
      this.metaService.removeTag(`name='twitter:site'`);
      this.metaService.removeTag(`name='twitter:creator'`);
    }
  }

  public setTwitterCard(card?: string): void {
    if (card && card.length) {
      this.metaService.updateTag({ name: 'twitter:card', content: card });
    } else {
      this.metaService.removeTag(`name='twitter:card'`);
    }
  }

  public setFbAppId(appId?: string): void {
    if (appId && appId.length) {
      this.metaService.updateTag({ property: 'fb:app_id', content: appId });
    } else {
      this.metaService.removeTag(`property='fb:app_id'`);
    }
  }

  public setMetaTag(metaTag: MetaTag): void {
    if (Boolean(metaTag.value)) {
      const metaTagObject = {
        [metaTag.attr]: metaTag.attrValue,
        content: metaTag.value,
      };
      this.metaService.updateTag(metaTagObject);
    } else {
      const selector = `${metaTag.attr}='${metaTag.attrValue}'`;
      this.metaService.removeTag(selector);
    }
  }

  public setMetaTags(metaTags: MetaTag[]): void {
    for (const metaTag of metaTags) {
      this.setMetaTag(metaTag);
    }
  }

  public setCanonicalUrl(url?: string) {
    // first remove potential previous url
    const selector = `link[rel='canonical']`;
    const canonicalElement = this.document.head.querySelector(selector);
    if (canonicalElement) {
      this.document.head.removeChild(canonicalElement);
    }

    if (url && url.length) {
      const link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
      link.setAttribute('href', url);
    }
  }

  public setTitle(title: string = '') {
    this.titleService.setTitle(title);
    if (title && title.length) {
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:image:alt', content: title });
      this.metaService.updateTag({ property: 'og:image:alt', content: title });
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ name: 'title', content: title });
    } else {
      this.metaService.removeTag(`name='twitter:title'`);
      this.metaService.removeTag(`name='twitter:image:alt'`);
      this.metaService.removeTag(`property='og:image:alt'`);
      this.metaService.removeTag(`property='og:title'`);
      this.metaService.removeTag(`name='title'`);
    }
  }

  public setType(type?: string) {
    if (type && type.length) {
      this.metaService.updateTag({ property: 'og:type', content: type });
    } else {
      this.metaService.removeTag(`property='og:type'`);
    }
  }

  public setMetaDescription(description?: string) {
    if (description && description.length) {
      this.metaService.updateTag({ name: 'twitter:description', content: description });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ name: 'description', content: description });
    } else {
      this.metaService.removeTag(`name='twitter:description'`);
      this.metaService.removeTag(`property='og:description'`);
      this.metaService.removeTag(`name='description'`);
    }
  }

  public setImage(image?: string) {
    if (image && image.length) {
      this.metaService.updateTag({ name: 'twitter:image', content: image });
      this.metaService.updateTag({ property: 'og:image', content: image });
      this.metaService.updateTag({ property: 'og:image:height', content: '630' });
    } else {
      this.metaService.removeTag(`name='twitter:image'`);
      this.metaService.removeTag(`property='og:image'`);
      this.metaService.removeTag(`property='og:image:height'`);
    }
  }

  public setUrl(url?: string) {
    if (url && url.length) {
      this.metaService.updateTag({ property: 'og:url', content: url });
    } else {
      this.metaService.removeTag(`property='og:url'`);
    }
    this.setCanonicalUrl(url);
  }

  public setPublished(publishedDateString?: string) {
    if (publishedDateString) {
      const publishedDate = new Date(publishedDateString);
      this.metaService.updateTag({ name: 'article:published_time', content: publishedDate.toISOString() });
      this.metaService.updateTag({ name: 'published_date', content: publishedDate.toISOString() });
    } else {
      this.metaService.removeTag(`name='article:published_time'`);
      this.metaService.removeTag(`name='publication_date'`);
    }
  }

  public setModified(modifiedDateString?: string) {
    if (modifiedDateString) {
      const modifiedDate = new Date(modifiedDateString);
      this.metaService.updateTag({ name: 'article:modified_time', content: modifiedDate.toISOString() });
      this.metaService.updateTag({ name: 'og:updated_time', content: modifiedDate.toISOString() });
    } else {
      this.metaService.removeTag(`name='article:modified_time'`);
      this.metaService.removeTag(`name='og:updated_time'`);
    }
  }

  public setAuthor(author?: string) {
    if (author && author.length) {
      this.metaService.updateTag({ name: 'article:author', content: author });
      this.metaService.updateTag({ name: 'author', content: author });
    } else {
      this.metaService.removeTag(`name='article:author'`);
      this.metaService.removeTag(`name='author'`);
    }
  }
}
