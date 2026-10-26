#!/usr/bin/env node
// Renders the WordPress.org /assets banner and icon (assets/wporg/) at the exact sizes the directory reads.
// Original artwork drawn in HTML/SVG: a stack of product tabs with a crest on the front tab.
// Screenshots stay in assets/screenshots/ (bin/screenshots.mjs). Run: node bin/wporg-assets.mjs
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const out = new URL( '../assets/wporg/', import.meta.url ).pathname;
mkdirSync( out, { recursive: true } );

const font = `'Noto Sans', 'DejaVu Sans', system-ui, sans-serif`;
const C = { ink: '#0d2230', deep: '#123a4a', teal: '#1f6f78', sea: '#2f8f8a', amber: '#f2b441', cream: '#fff7e6', mist: '#cfe6e3', paper: '#f6f8f8' };

/** The mark: three stacked folder tabs, the front one carrying a crest (chevron peak) and FAQ lines. */
function mark( size ) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${ size }" height="${ size }" viewBox="0 0 256 256">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${ C.sea }"/><stop offset="1" stop-color="${ C.ink }"/></linearGradient>
  <linearGradient id="front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${ C.cream }"/></linearGradient>
  <linearGradient id="crest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset="1" stop-color="${ C.amber }"/></linearGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#04131b" flood-opacity=".45"/></filter>
</defs>
<rect x="0" y="0" width="256" height="256" rx="48" fill="url(#bg)"/>
<rect x="1" y="1" width="254" height="254" rx="47" fill="none" stroke="#ffffff" stroke-opacity=".10" stroke-width="2"/>
<!-- back tab -->
<path d="M58 84 h44 a8 8 0 0 1 7 4 l9 14 h66 a10 10 0 0 1 10 10 v40 h-146 v-58 a10 10 0 0 1 10 -10z" fill="${ C.mist }" fill-opacity=".38"/>
<!-- middle tab -->
<path d="M50 104 h48 a8 8 0 0 1 7 4 l9 14 h80 a10 10 0 0 1 10 10 v44 h-164 v-62 a10 10 0 0 1 10 -10z" fill="${ C.mist }" fill-opacity=".62"/>
<!-- front tab with crest -->
<g filter="url(#sh)">
  <path d="M40 126 h56 a9 9 0 0 1 7.6 4.2 l10 15.8 h92 a12 12 0 0 1 12 12 v54 a12 12 0 0 1 -12 12 h-166 a12 12 0 0 1 -12 -12 v-74 a12 12 0 0 1 12 -12z" fill="url(#front)"/>
</g>
<path d="M48 150 l22 -18 l22 18 h-9 l-13 -10.5 l-13 10.5z" fill="url(#crest)"/>
<rect x="56" y="168" width="96" height="10" rx="5" fill="${ C.teal }"/>
<rect x="56" y="188" width="140" height="8" rx="4" fill="${ C.teal }" fill-opacity=".38"/>
<rect x="56" y="204" width="116" height="8" rx="4" fill="${ C.teal }" fill-opacity=".38"/>
<circle cx="190" cy="173" r="9" fill="${ C.amber }"/>
<path d="M186 173 h8 M190 169 v8" stroke="${ C.ink }" stroke-width="2.6" stroke-linecap="round"/>
</svg>`;
}

/** Product-page illustration for the banner: a tab strip and an open FAQ tab. */
function panel( w, h ) {
	const tabs = [ 'Description', 'Size guide', 'FAQ', 'Shipping' ];
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${ w }" height="${ h }" viewBox="-16 0 362 232" overflow="visible">
<defs><filter id="ps" x="-15%" y="-20%" width="130%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#020c12" flood-opacity=".5"/></filter></defs>
<g filter="url(#ps)"><rect x="6" y="18" width="318" height="176" rx="12" fill="${ C.paper }"/></g>
${ tabs.map( ( t, i ) => {
	const x = 18 + i * 76, active = 2 === i;
	return `<path d="M${ x } ${ active ? 30 : 34 } h66 a6 6 0 0 1 6 6 v${ active ? 22 : 18 } h-78 v-${ active ? 22 : 18 } a6 6 0 0 1 6 -6z" fill="${ active ? '#ffffff' : '#dfe8e8' }"/>
<text x="${ x + 33 }" y="${ active ? 47 : 49 }" text-anchor="middle" font-family="${ font }" font-size="10.5" font-weight="${ active ? 700 : 500 }" fill="${ active ? C.ink : '#4d6168' }">${ t }</text>
${ active ? `<rect x="${ x }" y="30" width="72" height="3" rx="1.5" fill="${ C.amber }"/>` : '' }`;
} ).join( '' ) }
<rect x="12" y="58" width="306" height="128" rx="6" fill="#ffffff"/>
<text x="26" y="80" font-family="${ font }" font-size="12.5" font-weight="700" fill="${ C.ink }">Sizing &amp; care FAQ</text>
${ [ [ 'Do they run true to size?', true ], [ 'Can I machine wash them?', false ], [ 'What is the return window?', false ] ].map( ( [ q, open ], i ) => {
	const y = [ 92, 138, 164 ][ i ];
	return `<line x1="26" y1="${ y }" x2="304" y2="${ y }" stroke="#e3eaea"/>
<text x="26" y="${ y + 16 }" font-family="${ font }" font-size="10.5" font-weight="600" fill="#2b3d44">${ q }</text>
<text x="300" y="${ y + 16 }" text-anchor="end" font-family="${ font }" font-size="12" font-weight="700" fill="${ C.teal }">${ open ? '−' : '+' }</text>
${ open ? `<rect x="26" y="${ y + 24 }" width="210" height="6" rx="3" fill="#cfdcdc"/><rect x="26" y="${ y + 34 }" width="160" height="6" rx="3" fill="#cfdcdc"/>` : '' }`;
} ).join( '' ) }
</svg>`;
}

function banner( w, h ) {
	const s = w / 772, k = ( n ) => Math.round( n * s );
	return `<div style="position:absolute;inset:0;overflow:hidden;font-family:${ font };color:#fff;
  background:radial-gradient(circle at 88% 10%, ${ C.sea }66, transparent 50%), radial-gradient(circle at 70% 120%, ${ C.amber }22, transparent 45%), linear-gradient(115deg, ${ C.ink }, ${ C.deep })">
  <div style="position:absolute;left:${ k( 34 ) }px;top:${ k( 28 ) }px;width:${ k( 414 ) }px">
    <div style="display:flex;align-items:center;gap:${ k( 10 ) }px">
      <div style="width:${ k( 30 ) }px;height:${ k( 30 ) }px">${ mark( k( 30 ) ) }</div>
      <div style="font:700 ${ k( 11 ) }px ${ font };letter-spacing:${ k( 2.2 ) }px;text-transform:uppercase;color:${ C.mist }">Free plugin for WooCommerce</div>
    </div>
    <div style="font:800 ${ k( 44 ) }px/1.05 ${ font };letter-spacing:-.5px;margin-top:${ k( 10 ) }px">Tabcrest</div>
    <div style="font:400 ${ k( 15.5 ) }px/1.38 ${ font };color:#dcecea;margin-top:${ k( 8 ) }px">Custom product tabs, FAQ tabs with schema and a manager for the default tabs. Nothing locked.</div>
    <div style="display:flex;flex-wrap:wrap;gap:${ k( 6 ) }px;margin-top:${ k( 13 ) }px">${ [ 'Global tabs', 'FAQ + schema', 'One-click import', 'GPL, free' ].map( ( c ) => `<span style="font:600 ${ k( 10.5 ) }px ${ font };background:#ffffff1a;border:1px solid #ffffff33;border-radius:${ k( 20 ) }px;padding:${ k( 4 ) }px ${ k( 9 ) }px;white-space:nowrap">${ c }</span>` ).join( '' ) }</div>
  </div>
  <div style="position:absolute;right:${ k( 8 ) }px;top:${ k( 20 ) }px;width:${ k( 316 ) }px;height:${ k( 203 ) }px">${ panel( k( 316 ), k( 203 ) ) }</div>
  <div style="position:absolute;right:${ k( 34 ) }px;bottom:${ k( 12 ) }px;font:600 ${ k( 10.5 ) }px ${ font };color:#a9c9c6">by PN Scripts · pnscripts.com</div>
</div>`;
}

const icon = ( size ) => `<div style="position:absolute;inset:0">${ mark( size ) }</div>`;

const jobs = [
	{ file: 'icon-128x128.png', w: 128, h: 128, html: icon( 128 ) },
	{ file: 'icon-256x256.png', w: 256, h: 256, html: icon( 256 ) },
	{ file: 'banner-772x250.png', w: 772, h: 250, html: banner( 772, 250 ) },
	{ file: 'banner-1544x500.png', w: 1544, h: 500, html: banner( 1544, 500 ) },
];

const browser = await puppeteer.launch( {
	executablePath: process.env.CHROME || '/usr/bin/google-chrome',
	headless: true,
	args: [ '--no-sandbox', '--hide-scrollbars', '--mute-audio', '--disable-speech-api', '--lang=en-US' ],
} );
const page = await browser.newPage();
for ( const j of jobs ) {
	await page.setViewport( { width: j.w, height: j.h, deviceScaleFactor: 1 } );
	await page.setContent( `<!doctype html><meta charset="utf-8"><body style="margin:0;width:${ j.w }px;height:${ j.h }px;position:relative;background:transparent">${ j.html }</body>`, { waitUntil: 'load' } );
	await page.evaluate( () => document.fonts.ready );
	await page.screenshot( { path: out + j.file, omitBackground: j.file.startsWith( 'icon' ) } );
	console.log( out + j.file );
}
await browser.close();
