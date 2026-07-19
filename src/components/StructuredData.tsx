import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { website, organization, breadcrumbList, webPage, toJsonLdScript } from '../core/seo/jsonld';
import type { JsonLdContext } from '../core/seo/jsonld';
import { ROUTE_META } from '../constants/routeMeta';

const BASE_URL = 'https://agriculturaantigua.com';

function injectScript(id: string, json: string) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = json;
  document.head.appendChild(script);
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (el) {
    el.setAttribute('content', content);
    return;
  }
  el = document.createElement('meta');
  if (name.startsWith('og:') || name.startsWith('twitter:')) {
    el.setAttribute('property', name);
  } else {
    el.setAttribute('name', name);
  }
  el.setAttribute('content', content);
  document.head.appendChild(el);
}

export default function StructuredData() {
  const location = useLocation();

  useEffect(() => {
    const pageMeta = ROUTE_META[location.pathname] ?? ROUTE_META['*'];
    const title = pageMeta?.title ?? 'Agricultura Antigua — Campus Agroecológico';
    const desc = pageMeta?.description ?? '';

    // Update document title + meta tags
    document.title = title;
    setMeta('description', desc);
    setMeta('og:title', title);
    setMeta('og:description', desc);
    setMeta('og:url', `${BASE_URL}${location.pathname}`);
    setMeta('twitter:title', title);
    setMeta('twitter:description', desc);

    const scripts: { id: string; json: string }[] = [];

    scripts.push(
      { id: 'ld-org', json: toJsonLdScript(organization()) },
      { id: 'ld-website', json: toJsonLdScript(website()) },
    );

    // Breadcrumb
    const crumbs = [{ name: 'Inicio', url: '/' }];
    const pathParts = location.pathname.split('/').filter(Boolean);
    let acc = '';
    for (const part of pathParts) {
      acc += `/${part}`;
      const meta = ROUTE_META[acc];
      crumbs.push({ name: meta?.title?.replace(' — Agricultura Antigua', '') ?? part, url: acc });
    }
    scripts.push({ id: 'ld-breadcrumb', json: toJsonLdScript(breadcrumbList(crumbs)) });

    // WebPage
    scripts.push({
      id: 'ld-page',
      json: toJsonLdScript(webPage({
        name: title,
        description: desc,
        url: location.pathname,
      })),
    });

    for (const s of scripts) injectScript(s.id, s.json);

    return () => {
      for (const s of scripts) {
        const el = document.getElementById(s.id);
        if (el) el.remove();
      }
    };
  }, [location.pathname]);

  return null;
}
