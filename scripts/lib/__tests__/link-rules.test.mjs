import { describe, it, expect } from 'vitest';
import {
  REQUIRED_EXTERNAL,
  classifyLink,
  internalLinkProblem,
  missingExternal,
} from '../link-rules.mjs';

const ORIGIN = 'https://www.paysdoc.nl';
const PAGE = 'https://www.paysdoc.nl/services';

describe('link crawl rules', () => {
  describe('classifyLink', () => {
    it('resolves relative and same-origin absolute hrefs as internal', () => {
      expect(classifyLink('/contact', PAGE, ORIGIN)).toMatchObject({
        kind: 'internal',
        url: 'https://www.paysdoc.nl/contact',
        hash: null,
      });
      expect(classifyLink('about', PAGE, ORIGIN)).toMatchObject({ kind: 'internal', url: 'https://www.paysdoc.nl/about' });
      expect(classifyLink('https://www.paysdoc.nl/login', PAGE, ORIGIN)).toMatchObject({ kind: 'internal' });
    });

    it('keeps the fragment of an internal link so the target id can be checked', () => {
      expect(classifyLink('/contact#form', PAGE, ORIGIN)).toMatchObject({
        kind: 'internal',
        url: 'https://www.paysdoc.nl/contact#form',
        hash: 'form',
      });
    });

    it('treats hash-only hrefs as same-page anchors and a bare "#" as other', () => {
      expect(classifyLink('#mobile-menu', PAGE, ORIGIN)).toMatchObject({ kind: 'anchor', hash: 'mobile-menu' });
      expect(classifyLink('#', PAGE, ORIGIN)).toMatchObject({ kind: 'other' });
    });

    it('classifies other http(s) origins, including the apex and http, as external', () => {
      expect(classifyLink('https://github.com/paysdoc', PAGE, ORIGIN)).toMatchObject({ kind: 'external' });
      expect(classifyLink('https://paysdoc.nl/', PAGE, ORIGIN)).toMatchObject({ kind: 'external' });
      expect(classifyLink('http://www.paysdoc.nl/', PAGE, ORIGIN)).toMatchObject({ kind: 'external' });
    });

    it('recognises mailto and tel, and reports the rest as other', () => {
      expect(classifyLink('mailto:info@paysdoc.nl', PAGE, ORIGIN)).toMatchObject({ kind: 'mailto' });
      expect(classifyLink('tel:+31600000000', PAGE, ORIGIN)).toMatchObject({ kind: 'tel' });
      expect(classifyLink('javascript:void(0)', PAGE, ORIGIN)).toMatchObject({ kind: 'other' });
      expect(classifyLink('', PAGE, ORIGIN)).toMatchObject({ kind: 'other' });
      expect(classifyLink(undefined, PAGE, ORIGIN)).toMatchObject({ kind: 'other' });
    });
  });

  describe('internalLinkProblem', () => {
    it('accepts a direct 200 only', () => {
      expect(internalLinkProblem({ status: 200 })).toBeNull();
    });

    it('reports redirects with their target and every other status', () => {
      expect(internalLinkProblem({ status: 308, location: 'https://www.paysdoc.nl/contact' })).toBe(
        'redirects (308) to https://www.paysdoc.nl/contact'
      );
      expect(internalLinkProblem({ status: 404 })).toBe('HTTP 404');
      expect(internalLinkProblem({ status: 500 })).toBe('HTTP 500');
    });
  });

  describe('missingExternal', () => {
    const linkedin = classifyLink('https://www.linkedin.com/in/martinkoster', PAGE, ORIGIN);
    const github = classifyLink('https://github.com/paysdoc', PAGE, ORIGIN);
    const mail = classifyLink('mailto:info@paysdoc.nl', PAGE, ORIGIN);

    it('requires LinkedIn, GitHub and a mailto link', () => {
      expect(REQUIRED_EXTERNAL.map((r) => r.name)).toEqual(['LinkedIn', 'GitHub', 'mailto']);
      expect(missingExternal([linkedin, github, mail])).toEqual([]);
    });

    it('accepts the company LinkedIn page without the www prefix', () => {
      const company = classifyLink('https://linkedin.com/company/paysdoc', PAGE, ORIGIN);
      expect(missingExternal([company, github, mail])).toEqual([]);
    });

    it('lists what is missing, in the required order', () => {
      expect(missingExternal([github])).toEqual(['LinkedIn', 'mailto']);
      expect(missingExternal([])).toEqual(['LinkedIn', 'GitHub', 'mailto']);
    });

    it('does not let a look-alike host satisfy a requirement', () => {
      const fake = classifyLink('https://github.com.evil.example/paysdoc', PAGE, ORIGIN);
      expect(missingExternal([fake, linkedin, mail])).toEqual(['GitHub']);
    });
  });
});
