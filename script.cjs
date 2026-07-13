const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newCardData = {
    title: 'Village Watchdogs',
    tags: ['Local Business', 'Web Design'],
    desc: 'An accredited home watch and property oversight company serving The Villages and Lady Lake, Florida since 2008. Built to convert seasonal and out-of-state homeowners with clear service checklists, storm-response coverage, and a fast quote-request form.',
    tech: ['HTML', 'CSS', 'Vanilla JS'],
    url: 'https://village-watch-dogs.vercel.app/'
};

let adMatch = html.match(/<!--[\s\S]*?CARD 2 · A&D Store live iframe[\s\S]*?(?=<!--[\s\S]*?CARD 3)/);
if (!adMatch) { console.log('Could not find A&D block'); process.exit(1); }

let adStoreBlock = adMatch[0];

let newBlock = adStoreBlock;
newBlock = newBlock.replace('CARD 2 · A&D Store live iframe', 'CARD X · Village Watchdogs live iframe');
newBlock = newBlock.replace(/<span class="pf-tag">E-commerce<\/span>\s*<span class="pf-tag">Hardware<\/span>/, '<span class="pf-tag">Local Business</span>\n          <span class="pf-tag">Web Design</span>');
newBlock = newBlock.replace('A&amp;D Store Kenya', 'Village Watchdogs');
newBlock = newBlock.replace(/Kenya's trusted online supplier for hardware and premium building materials.[\s\S]*?contractor-focused browsing experience./, newCardData.desc);
newBlock = newBlock.replace(/<span>WooCommerce<\/span>\s*<span>Custom UI<\/span>/, '<span>HTML</span>\n            <span>CSS</span>\n            <span>Vanilla JS</span>');
newBlock = newBlock.replace(/https:\/\/aanddstore\.co\.ke\//g, newCardData.url);

let mcEngineMatch = html.match(/(<!--[\s\S]*?CARD 4 · Mobile Commerce Engine)/);
if (!mcEngineMatch) { console.log('Could not find insert point'); process.exit(1); }

let insertPos = mcEngineMatch.index;

html = html.substring(0, insertPos) + newBlock + html.substring(insertPos);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully inserted the new card.');
