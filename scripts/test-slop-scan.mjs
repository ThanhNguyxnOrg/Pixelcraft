import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node scripts/test-slop-scan.mjs');
  process.exit(0);
}

const base = new URL('../skills/pixelcraft-review/scripts/', import.meta.url);
const local = (relative) => fileURLToPath(new URL(relative, base));
const runPath = (target, ...args) => {
  const result = spawnSync(process.execPath, [local('slop-scan.mjs'), target, '--json', ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
};
const run = (file, ...args) => runPath(local(`fixtures/${file}`), ...args);

assert.equal(run('slop.html').score, 40);
assert.equal(run('clean.html').score, 0);
const { findings } = run('brand-critique.css');
assert.deepEqual(findings.map(({ rule, line }) => [rule, line]), [
  ['gradient-text-treatment', 3], ['rounded-accent-rail', 8],
]);
console.log('ok 1 - advisory rules flag decorative forms, not plain styles, and preserve prior scores');

const waived = run('brand-critique.css', '--waivers', local('fixtures/brand-critique-waivers.json'));
assert.deepEqual(waived.findings.map(({ rule }) => rule), ['rounded-accent-rail']);
assert.equal(waived.waived[0].label, 'waived');
assert.match(waived.waived[0].reason, /approved wordmark/i);
assert.equal(waived.unusedWaivers[0].line, 17);
console.log('ok 2 - scoped brand waiver preserves the evidence and reports stale waivers');

const longhand = run('focus-longhand-removal.css');
assert.deepEqual(longhand.findings.map(({ rule, line, match }) => [rule, line, match]), [
  ['outline-removed', 2, 'outline-style: none'],
  ['outline-removed', 6, 'outline-style: hidden'],
  ['outline-removed', 10, 'outline-width: 0'],
  ['outline-removed', 14, 'outline: none'],
  ['outline-removed', 19, 'outline: none'],
]);
console.log('ok 3 - longhand outline removals and zero/transparent box-shadow non-replacements are caught while system/light-dark/contrast-color tokens pass');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-slop-scan-'));
try {
  // Tailwind + inline styles + positive-tabindex + generic-copy + motion
  const twBad = path.join(tmp, 'BadComponent.tsx');
  fs.writeFileSync(twBad, `export function BadComponent() {
  return (
    <div>
      <button className="px-4 focus:outline-none">No ring</button>
      <a className="focus-visible:outline-0 focus-visible:ring-0" href="/x">Zero ring</a>
      <button className="focus:outline-none focus-visible:ring-2">Safe ring</button>
      <button className="focus:outline-none focus-visible:outline-2">Safe outline</button>
      <button className="focus:outline-none focus:border-blue-600">Safe border</button>
      <div className="transition-all duration-200">Broad transition</div>
      <h1 className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">Banner</h1>
      <h2 className="bg-linear-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">V4 Banner</h2>
      <span className="animate-bounce">Bouncing</span>
      <button style={{ outline: 'none' }}>Inline outline none</button>
      <input tabIndex={2} aria-label="Order" />
      <p>Supercharge your cutting-edge analytics</p>
    </div>
  );
}
`);
  const twRes = runPath(twBad);
  const rulesAndLines = twRes.findings.map(({ rule, line }) => `${rule}:${line}`);
  assert.ok(rulesAndLines.includes('outline-removed:4'), `expected focus:outline-none: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('outline-removed:5'), `expected focus-visible:outline-0 with ring-0: ${rulesAndLines}`);
  assert.ok(!rulesAndLines.includes('outline-removed:6'), `safe ring flagged: ${rulesAndLines}`);
  assert.ok(!rulesAndLines.includes('outline-removed:7'), `safe outline flagged: ${rulesAndLines}`);
  assert.ok(!rulesAndLines.includes('outline-removed:8'), `safe border flagged: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('transition-all:9'), `expected Tailwind transition-all: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('gradient-text-treatment:10'), `expected Tailwind bg-gradient-to: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('gradient-text-treatment:11'), `expected Tailwind bg-linear-to: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('missing-reduced-motion:12'), `expected Tailwind animate-bounce missing reduced motion: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('outline-removed:13'), `expected inline JSX outline none: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('positive-tabindex:14'), `expected positive tabIndex: ${rulesAndLines}`);
  assert.equal(twRes.findings.find((f) => f.rule === 'positive-tabindex').weight, 3);
  assert.ok(rulesAndLines.includes('generic-copy:15'), `expected supercharge/cutting-edge: ${rulesAndLines}`);
  console.log('ok 4 - Tailwind utilities, inline styles, positive-tabindex, and supercharge/cutting-edge copy are detected');

  // False-positive reductions: useTransition, code identifiers, labeled multi-line inputs, custom brand font stack, motion-reduce
  const cleanTsx = path.join(tmp, 'CleanComponent.tsx');
  fs.writeFileSync(cleanTsx, `import { useTransition } from 'react';
// animation: fade 1s; transition: all 200ms; font-family: Inter;
export function unlockAccount(getStartedUrl: string) {
  const [isPending, startTransition] = useTransition();
  const unlock_account = Boolean(getStartedUrl);
  return (
    <form style={{ fontFamily: "'Fraunces', Inter, sans-serif" }}>
      <label htmlFor="email-field">Work email</label>
      <input
        id="email-field"
        type="email"
        placeholder="name@company.com"
        tabIndex={0}
      />
      <label>
        Notes
        <textarea
          rows={3}
          placeholder="Optional details"
          tabIndex={-1}
        />
      </label>
      <span className="animate-spin motion-reduce:animate-none">{isPending ? 'Saving' : String(unlock_account)}</span>
    </form>
  );
}
`);
  const cleanTsxRes = runPath(cleanTsx);
  assert.deepEqual(cleanTsxRes.findings, [], `unexpected findings on clean TSX: ${JSON.stringify(cleanTsxRes.findings)}`);

  // Multi-line unlabeled input IS still caught, and default-font-only stack IS caught
  const unlabeled = path.join(tmp, 'Unlabeled.astro');
  fs.writeFileSync(unlabeled, `<style>
  body { font-family: 'Inter', system-ui, sans-serif; }
  .brand { font-family: 'Fraunces', Inter, sans-serif; }
  button:focus-visible { outline-style: none; }
</style>
<input
  type="text"
  placeholder="Search inventory"
  tabindex="3"
/>
`);
  const astroRes = runPath(unlabeled);
  assert.deepEqual(astroRes.findings.map(({ rule, line }) => [rule, line]).sort((a, b) => a[1] - b[1]), [
    ['default-font-only', 2],
    ['outline-removed', 4],
    ['placeholder-as-label', 6],
    ['positive-tabindex', 9],
  ]);
  console.log('ok 5 - false positives are avoided for useTransition, code identifiers, labeled multi-line inputs, and brand font stacks while real defects in .astro are caught');

  // Expanded extensions, skips, and skillHosts
  const walkDir = path.join(tmp, 'walk-test');
  fs.mkdirSync(path.join(walkDir, '.next'), { recursive: true });
  fs.mkdirSync(path.join(walkDir, '.windsurf/skills/pixelcraft-review'), { recursive: true });
  fs.mkdirSync(path.join(walkDir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(walkDir, '.next', 'ignored.css'), 'button:focus { outline: none; }\n');
  fs.writeFileSync(path.join(walkDir, '.windsurf/skills/pixelcraft-review', 'ignored.css'), 'button:focus { outline: none; }\n');
  fs.writeFileSync(path.join(walkDir, 'src', 'app.pcss'), 'button:focus-visible { outline-width: 0; }\n');
  fs.writeFileSync(path.join(walkDir, 'src', 'hud.gd'), '# TODO: wire stamina bar\nvar color = "#ffffff"\n');
  const walkRes = runPath(walkDir);
  assert.equal(walkRes.findings.length, 2);
  assert.deepEqual(walkRes.findings.map((f) => [f.file.replace(/\\/g, '/'), f.rule]).sort(), [
    ['src/app.pcss', 'outline-removed'],
    ['src/hud.gd', 'todo-stub-in-ui'],
  ]);
  console.log('ok 6 - directory scan includes expanded extensions (including .gd/.pcss) and skips build directories and installed skill hosts');

  // Anti-laziness detectors: TODO/FIXME/ellipsis stubs, empty event handlers, lazy DIY antipatterns, and 2025-2026 generic copy
  const lazyTsx = path.join(tmp, 'LazyView.tsx');
  fs.writeFileSync(lazyTsx, `export function LazyView() {
  // TODO: implement pagination
  const runFormat = () => document.execCommand('bold');
  const empower = (x: string) => x;
  return (
    <form onSubmit={(e) => { e.preventDefault(); }}>
      <p>Built for modern teams with an ai-powered, effortless, next-gen workspace.</p>
      {/* ... more items */}
      <button onClick={() => {}}>Submit</button>
      <a href="#">Dead anchor</a>
      <a href="#" onClick={runFormat}>Handled anchor</a>
      <a href="#" role="button">Role anchor</a>
      <span>{empower('ok')}</span>
    </form>
  );
}
`);
  const lazyRes = runPath(lazyTsx);
  const lazyRules = lazyRes.findings.map(({ rule, line }) => `${rule}:${line}`);
  assert.ok(lazyRules.includes('todo-stub-in-ui:2'), `expected TODO stub: ${lazyRules}`);
  assert.ok(lazyRules.includes('lazy-diy-antipattern:3'), `expected execCommand: ${lazyRules}`);
  assert.ok(lazyRules.includes('empty-event-handler:6'), `expected preventDefault-only onSubmit: ${lazyRules}`);
  assert.ok(lazyRules.includes('generic-copy:7'), `expected 2025-2026 AI clichés: ${lazyRules}`);
  assert.ok(lazyRules.includes('todo-stub-in-ui:8'), `expected ellipsis stub: ${lazyRules}`);
  assert.ok(lazyRules.includes('empty-event-handler:9'), `expected empty onClick: ${lazyRules}`);
  assert.ok(lazyRules.includes('empty-event-handler:10'), `expected dead href="#": ${lazyRules}`);
  assert.ok(!lazyRules.includes('empty-event-handler:11'), `handled href="#" false positive: ${lazyRules}`);
  assert.ok(!lazyRules.includes('empty-event-handler:12'), `role="button" href="#" false positive: ${lazyRules}`);
  assert.ok(!lazyRules.includes('generic-copy:4'), `identifier empower false positive: ${lazyRules}`);
  assert.ok(!lazyRules.includes('generic-copy:13'), `call empower() false positive: ${lazyRules}`);
  console.log('ok 7 - anti-laziness detectors (TODO/ellipsis stubs, empty handlers, execCommand) and 2025-2026 AI copy work with zero false positives on valid code');

  // Python # comment masking, hex preservation, tkinter detection, Lua -- & ClojureScript ; comment masking
  const pyFile = path.join(tmp, 'desktop_app.py');
  fs.writeFileSync(pyFile, `# Seamless effortless dashboard comment that should be masked
import tkinter as tk
# TODO: replace placeholder dialog
PALETTE = """
  background: #fff;
  color: #111111;
"""
label = "Revenue ledger"  # unleash next-gen
`);
  const pyRes = runPath(pyFile);
  assert.deepEqual(pyRes.findings.map(({ rule, line }) => [rule, line]), [
    ['todo-stub-in-ui', 3],
    ['lazy-diy-antipattern', 2],
  ]);

  const cleanPy = path.join(tmp, 'clean_app.py');
  fs.writeFileSync(cleanPy, `# Effortless next-gen comment is masked and ignored
PRIMARY = "#fff"  # delve into notes
SECONDARY = '#1a2b3c'
`);
  assert.deepEqual(runPath(cleanPy).findings, [], 'clean Python file with # comments and hex strings should produce zero findings');

  const luaFile = path.join(tmp, 'hud.lua');
  fs.writeFileSync(luaFile, `-- Seamless effortless next-gen comment\nlocal title = "Inventory"\n`);
  assert.deepEqual(runPath(luaFile).findings, [], 'Lua -- comment should be masked');

  const cljsFile = path.join(tmp, 'view.cljs');
  fs.writeFileSync(cljsFile, `; Seamless next-gen comment\n(def label "Ledger 'ok")\n`);
  assert.deepEqual(runPath(cljsFile).findings, [], 'ClojureScript ; comment should be masked');

  const cssHash = path.join(tmp, 'todo.css');
  fs.writeFileSync(cssHash, `#todo { color: var(--ink); }\n`);
  assert.deepEqual(runPath(cssHash).findings, [], 'CSS #todo ID selector must not trigger todo-stub-in-ui');
  console.log('ok 8 - Python #, Lua --, and ClojureScript ; comment masking preserve hex strings and avoid CSS #todo false positives');

  // Native non-JS floor rules + native reduced-motion + hardcoded-color-literals fix
  const ktBad = path.join(tmp, 'BadScreen.kt');
  fs.writeFileSync(ktBad, `import androidx.compose.ui.graphics.Color
val c1 = Color(0xFF112233)
val c2 = Color(0xFF223344)
val c3 = Color(0xFF334455)
val c4 = Color(0xFF445566)
val c5 = Color(0xFF556677)
val c6 = Color(0xFF667788)
val raw = Color.Red
val raw2 = Color.Blue
val alpha by animateFloatAsState(targetValue = 1f)
Text("Total", fontSize = 14.dp)
`);
  const ktRes = runPath(ktBad);
  const ktRules = ktRes.findings.map((f) => f.rule);
  assert.ok(ktRules.includes('compose-dp-font-size'), `expected compose-dp-font-size: ${ktRules}`);
  assert.ok(ktRules.includes('missing-reduced-motion'), `expected Compose reduced-motion: ${ktRules}`);
  assert.ok(ktRules.includes('hardcoded-color-literals'), `expected hardcoded-color-literals despite Color.Red/Blue: ${ktRules}`);

  const ktGood = path.join(tmp, 'GoodScreen.kt');
  fs.writeFileSync(ktGood, `val scale = Settings.Global.ANIMATOR_DURATION_SCALE
val tint = MaterialTheme.colorScheme.primary
val alpha by animateFloatAsState(targetValue = if (scale == 0f) 1f else 0.5f)
Text("Total", fontSize = 14.sp, color = tint)
`);
  assert.deepEqual(runPath(ktGood).findings, [], 'clean Compose file with .sp, MaterialTheme.colorScheme, and ANIMATOR_DURATION_SCALE passes');

  const dartBad = path.join(tmp, 'bad_widget.dart');
  fs.writeFileSync(dartBad, `final ctrl = AnimationController(vsync: this);
final child = MediaQuery(data: data.copyWith(textScaler: TextScaler.noScaling), child: Text("Hi"));
`);
  const dartRes = runPath(dartBad);
  assert.deepEqual(dartRes.findings.map((f) => f.rule).sort(), ['flutter-text-scaling-locked', 'missing-reduced-motion']);

  const dartGood = path.join(tmp, 'good_widget.dart');
  fs.writeFileSync(dartGood, `final reduce = MediaQuery.disableAnimationsOf(context);
final ctrl = AnimationController(vsync: this, duration: reduce ? Duration.zero : Duration(milliseconds: 200));
final themeColor = Theme.of(context).colorScheme.primary;
`);
  assert.deepEqual(runPath(dartGood).findings, [], 'clean Flutter file with disableAnimations and Theme.of passes');

  const swiftBad = path.join(tmp, 'BadView.swift');
  fs.writeFileSync(swiftBad, `struct BadView: View {
  var body: some View {
    Button("Save") { withAnimation { expanded.toggle() } }
  }
}
`);
  assert.deepEqual(runPath(swiftBad).findings.map((f) => f.rule), ['missing-reduced-motion']);

  const swiftGood = path.join(tmp, 'GoodView.swift');
  fs.writeFileSync(swiftGood, `struct GoodView: View {
  @Environment(\\.accessibilityReduceMotion) var reduceMotion
  var body: some View {
    Button("Save") { withAnimation(reduceMotion ? nil : .default) { expanded.toggle() } }
      .foregroundStyle(Color("SurfaceInk"))
  }
}
`);
  assert.deepEqual(runPath(swiftGood).findings, [], 'clean SwiftUI file with accessibilityReduceMotion passes');

  const rsBad = path.join(tmp, 'bad_egui.rs');
  fs.writeFileSync(rsBad, `fn update(ctx: &egui::Context) {
  let _a = [Color32::from_rgb(1,2,3), Color32::from_rgb(2,3,4), Color32::from_rgb(3,4,5),
            Color32::from_rgb(4,5,6), Color32::from_rgb(5,6,7), Color32::from_rgb(6,7,8)];
  ctx.request_repaint();
}
`);
  assert.deepEqual(runPath(rsBad).findings.map((f) => f.rule).sort(), ['egui-unconditional-repaint', 'hardcoded-color-literals']);

  const rsGood = path.join(tmp, 'good_egui.rs');
  fs.writeFileSync(rsGood, `fn update(ctx: &egui::Context) {
  ctx.request_repaint_after(std::time::Duration::from_millis(250));
}
`);
  assert.deepEqual(runPath(rsGood).findings, [], 'egui using request_repaint_after passes');

  const gsapBad = path.join(tmp, 'MotionCard.tsx');
  fs.writeFileSync(gsapBad, `export function MotionCard() {
  gsap.to('.box', { x: 100 });
  return <motion.div whileInView={{ opacity: 1 }}>Content</motion.div>;
}
`);
  assert.deepEqual(runPath(gsapBad).findings.map((f) => f.rule), ['missing-reduced-motion']);

  const gsapGood = path.join(tmp, 'MotionCardSafe.tsx');
  fs.writeFileSync(gsapGood, `export function MotionCardSafe() {
  const prefersReduced = useReducedMotion();
  return <motion.div whileInView={{ opacity: 1 }}>{String(prefersReduced)}</motion.div>;
}
`);
  assert.deepEqual(runPath(gsapGood).findings, [], 'Motion with useReducedMotion passes');
  console.log('ok 9 - native floor rules (Compose .dp, Flutter TextScaler.noScaling, egui request_repaint), SwiftUI/Compose/Flutter/GSAP/Motion reduced-motion, and color literal rules work');

  // --fail-on threshold behavior and --help documentation
  const helpOut = spawnSync(process.execPath, [local('slop-scan.mjs'), '--help'], { encoding: 'utf8' });
  assert.equal(helpOut.status, 0);
  assert.match(helpOut.stdout, /--fail-on/);

  const p0Fail = spawnSync(process.execPath, [local('slop-scan.mjs'), dartBad, '--json', '--fail-on', 'p0'], { encoding: 'utf8' });
  assert.equal(p0Fail.status, 1, 'P0 finding must fail under --fail-on p0');
  assert.equal(JSON.parse(p0Fail.stdout).findings.some((f) => f.severity === 'P0'), true);

  const p0PassOnP1Only = spawnSync(process.execPath, [local('slop-scan.mjs'), swiftBad, '--json', '--fail-on', 'p0'], { encoding: 'utf8' });
  assert.equal(p0PassOnP1Only.status, 0, 'P1-only finding should exit 0 under --fail-on p0');

  const p1FailOnP1 = spawnSync(process.execPath, [local('slop-scan.mjs'), swiftBad, '--json', '--fail-on=p1'], { encoding: 'utf8' });
  assert.equal(p1FailOnP1.status, 1, 'P1 finding must fail under --fail-on=p1');

  const anyFailOnP3 = spawnSync(process.execPath, [local('slop-scan.mjs'), local('fixtures/brand-critique.css'), '--fail-on', 'any'], { encoding: 'utf8' });
  assert.equal(anyFailOnP3.status, 1, 'P3 finding must fail under --fail-on any');

  const cleanAny = spawnSync(process.execPath, [local('slop-scan.mjs'), local('fixtures/clean.html'), '--fail-on', 'any'], { encoding: 'utf8' });
  assert.equal(cleanAny.status, 0, 'clean file must exit 0 under --fail-on any');

  const invalidFailOn = spawnSync(process.execPath, [local('slop-scan.mjs'), local('fixtures/clean.html'), '--fail-on', 'p9'], { encoding: 'utf8' });
  assert.equal(invalidFailOn.status, 1);
  console.log('ok 10 - --fail-on p0|p1|p2|any enforces severity exit gates while preserving default exit 0');

  // 11. Studio-Grade 2026 rules: ime-enter-without-composing, important-override-sprawl, and mv3-remote-script
  const imeBad = path.join(tmp, 'ChatComposerBad.tsx');
  fs.writeFileSync(imeBad, `export function ChatComposerBad({ send }: { send: () => void }) {
  return (
    <label>
      Message
      <textarea onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
    </label>
  );
}
`);
  assert.deepEqual(runPath(imeBad).findings.map((f) => f.rule), ['ime-enter-without-composing']);

  const imeGood = path.join(tmp, 'ChatComposerGood.tsx');
  fs.writeFileSync(imeGood, `export function ChatComposerGood({ send }: { send: () => void }) {
  return (
    <label>
      Message
      <textarea onKeyDown={(e) => {
        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
      }} />
    </label>
  );
}
`);
  assert.deepEqual(runPath(imeGood).findings, [], 'IME-guarded Enter handler should pass');

  const impBad = path.join(tmp, 'sprawl.css');
  fs.writeFileSync(impBad, `.a { color: var(--ink) !important; }
.b { padding: 8px !important; }
.c { margin: 0 !important; }
.d { display: block !important; }
`);
  assert.deepEqual(runPath(impBad).findings.map((f) => f.rule), ['important-override-sprawl']);

  const impGood = path.join(tmp, 'a11y-print.css');
  fs.writeFileSync(impGood, `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
@media print {
  .no-print { display: none !important; }
  .sheet { background: transparent !important; }
}
`);
  assert.deepEqual(runPath(impGood).findings, [], 'prefers-reduced-motion and @media print !important resets must not be flagged');

  const mv3Dir = path.join(tmp, 'mv3-ext');
  fs.mkdirSync(mv3Dir, { recursive: true });
  fs.writeFileSync(path.join(mv3Dir, 'manifest.json'), JSON.stringify({ manifest_version: 3, name: 'Test Ext', version: '1.0.0' }));
  const mv3Popup = path.join(mv3Dir, 'popup.html');
  fs.writeFileSync(mv3Popup, `<!doctype html><html lang="en"><head><title>Ext</title><script src="https://cdn.example.com/sdk.js"></script></head><body><h1>Inspector</h1></body></html>\n`);
  assert.deepEqual(runPath(mv3Popup).findings.map((f) => f.rule), ['mv3-remote-script']);

  const regularWeb = path.join(tmp, 'marketing.html');
  fs.writeFileSync(regularWeb, `<!doctype html><html lang="en"><head><title>Site</title><script src="https://plausible.io/js/script.js" defer></script></head><body><h1>Docs</h1></body></html>\n`);
  assert.deepEqual(runPath(regularWeb).findings, [], 'normal non-MV3 web page with deferred script should not trigger mv3-remote-script');
  console.log('ok 11 - ime-enter-without-composing, important-override-sprawl, and mv3-remote-script catch real defects with zero false positives');

  // 12. Wave 3 high-precision rules: mobile-input-zoom-risk, div-as-link-or-button, disabled-button-tooltip, alert-with-aria-live, bfcache-unload-listener
  const wave3BadCss = path.join(tmp, 'zoom-bad.css');
  fs.writeFileSync(wave3BadCss, `input, select { font-size: 14px; }
textarea { font-size: 0.875rem; }
input[type="checkbox"] { font-size: 12px; }
input::placeholder { font-size: 13px; }
@media (min-width: 768px) {
  input { font-size: 14px; }
}
`);
  const zoomCssRes = runPath(wave3BadCss);
  assert.deepEqual(zoomCssRes.findings.map(({ rule, line }) => [rule, line]), [
    ['mobile-input-zoom-risk', 1],
    ['mobile-input-zoom-risk', 2],
  ], `expected only mobile editable fields <16px: ${JSON.stringify(zoomCssRes.findings)}`);

  const wave3BadTsx = path.join(tmp, 'Wave3Bad.tsx');
  fs.writeFileSync(wave3BadTsx, `export function Wave3Bad({ open, save }: { open: () => void; save: () => void }) {
  window.addEventListener('unload', () => save());
  return (
    <div>
      <div role="alert" aria-live="assertive">Payment failed</div>
      <div onClick={open}>Clickable div</div>
      <span onClick={open}>Clickable span</span>
      <button disabled title="Complete required fields first">Submit</button>
      <input aria-label="Phone" className="text-sm px-3" />
    </div>
  );
}
`);
  const wave3BadRes = runPath(wave3BadTsx);
  assert.deepEqual(
    wave3BadRes.findings.map(({ rule, line }) => [rule, line]).sort((a, b) => a[1] - b[1]),
    [
      ['bfcache-unload-listener', 2],
      ['alert-with-aria-live', 5],
      ['div-as-link-or-button', 6],
      ['div-as-link-or-button', 7],
      ['disabled-button-tooltip', 8],
      ['mobile-input-zoom-risk', 9],
    ],
    `unexpected Wave 3 findings: ${JSON.stringify(wave3BadRes.findings)}`,
  );

  const wave3GoodTsx = path.join(tmp, 'Wave3Good.tsx');
  fs.writeFileSync(wave3GoodTsx, `export function Wave3Good({ open, save }: { open: () => void; save: () => void }) {
  window.addEventListener('pagehide', () => save());
  window.addEventListener('beforeunload', () => save());
  return (
    <div>
      <div role="alert">Payment failed</div>
      <div role="status" aria-live="polite">Saved</div>
      <div role="button" tabIndex={0} onClick={open} onKeyDown={open}>Accessible composite</div>
      <div onClick={(e) => e.stopPropagation()}>Modal surface</div>
      <button aria-disabled="true" title="Complete required fields first">Submit</button>
      <button disabled={false} title="Save changes">Save</button>
      <input aria-label="Phone" className="text-base md:text-sm px-3" />
      <input type="checkbox" aria-label="Agree" className="text-xs" />
    </div>
  );
}
`);
  assert.deepEqual(runPath(wave3GoodTsx).findings, [], `clean Wave 3 component should have zero findings: ${JSON.stringify(runPath(wave3GoodTsx).findings)}`);
  console.log('ok 12 - mobile-input-zoom-risk, div-as-link-or-button, disabled-button-tooltip, alert-with-aria-live, and bfcache-unload-listener catch real defects with zero false positives');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}



