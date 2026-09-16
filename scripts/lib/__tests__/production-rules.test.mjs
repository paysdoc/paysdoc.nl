import { describe, it, expect } from 'vitest';
import {
  PRODUCTION_ORIGIN,
  ogUrlProblem,
  requestProblem,
  requestProblems,
} from '../production-rules.mjs';

describe('production smoke rules', () => {
  it('pins the production origin to the www host over https', () => {
    expect(PRODUCTION_ORIGIN).toBe('https://www.paysdoc.nl');
  });

  describe('ogUrlProblem', () => {
    it('accepts og:url values on the production origin, with or without a path', () => {
      expect(ogUrlProblem('https://www.paysdoc.nl')).toBeNull();
      expect(ogUrlProblem('https://www.paysdoc.nl/')).toBeNull();
      expect(ogUrlProblem('https://www.paysdoc.nl/about')).toBeNull();
    });

    it('rejects missing, relative, apex, http and preview-host og:url values', () => {
      expect(ogUrlProblem('')).toMatch(/missing/);
      expect(ogUrlProblem(undefined)).toMatch(/missing/);
      expect(ogUrlProblem('/')).toMatch(/does not start with/);
      expect(ogUrlProblem('https://paysdoc.nl/')).toMatch(/does not start with/);
      expect(ogUrlProblem('http://www.paysdoc.nl/')).toMatch(/does not start with/);
      expect(ogUrlProblem('https://paysdoc-nl.paysdoc.workers.dev/')).toMatch(/does not start with/);
    });
  });

  describe('requestProblem', () => {
    it('allows https requests to the production origin and to third parties', () => {
      expect(requestProblem('https://www.paysdoc.nl/_next/static/chunks/app.js')).toBeNull();
      expect(requestProblem('https://fonts.gstatic.com/x.woff2')).toBeNull();
    });

    it('ignores non-http(s) schemes such as data: and blob:', () => {
      expect(requestProblem('data:image/png;base64,AAAA')).toBeNull();
      expect(requestProblem('blob:https://www.paysdoc.nl/1234')).toBeNull();
    });

    it('flags any request over plain http', () => {
      expect(requestProblem('http://www.paysdoc.nl/logo-simpel.png')).toMatch(/plain http/);
      expect(requestProblem('http://cdn.example.com/x.js')).toMatch(/plain http/);
    });

    it('flags requests to the retired *.pages.dev project, including sub-subdomains', () => {
      expect(requestProblem('https://paysdoc-nl.pages.dev/x.js')).toMatch(/retired Pages project/);
      expect(requestProblem('https://abc123.paysdoc-nl.pages.dev/x.js')).toMatch(/retired Pages project/);
      expect(requestProblem('https://PAYSDOC-NL.PAGES.DEV/x.js')).toMatch(/retired Pages project/);
    });

    it('does not confuse look-alike hosts with pages.dev', () => {
      expect(requestProblem('https://notpages.dev/x.js')).toBeNull();
      expect(requestProblem('https://pages.dev.example.com/x.js')).toBeNull();
    });

    it('reports unparseable URLs instead of throwing', () => {
      expect(requestProblem('not a url')).toMatch(/unparseable/);
    });
  });

  describe('requestProblems', () => {
    it('collects each distinct problem once, in first-seen order', () => {
      const urls = [
        'https://www.paysdoc.nl/',
        'http://www.paysdoc.nl/a.js',
        'https://paysdoc-nl.pages.dev/b.js',
        'http://www.paysdoc.nl/a.js',
      ];
      expect(requestProblems(urls)).toEqual([
        'served over plain http: http://www.paysdoc.nl/a.js',
        'served from the retired Pages project: https://paysdoc-nl.pages.dev/b.js',
      ]);
    });

    it('returns an empty list for a clean page', () => {
      expect(requestProblems(['https://www.paysdoc.nl/', 'https://www.paysdoc.nl/x.css'])).toEqual([]);
    });
  });
});
