// Сайт Lexey: шапка, подвал, тема, анимации и вывод проектов из projects-data.js
(function () {
  const P = window.PROJECTS || [];
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = u => /^https?:\/\//i.test(u || '') ? esc(u) : '';
  const plural = (n, a, b, c) => { const m = n % 100, d = n % 10; return (m > 10 && m < 20) ? c : d === 1 ? a : (d > 1 && d < 5) ? b : c; };
  window.PF = { esc, tagCls: () => '', plural };

  const NAV = [['index.html', 'Главная'], ['projects.html', 'Работы'], ['about.html', 'Обо мне'], ['contact.html', 'Контакты']];
  const C = { tg: 'https://t.me/rickprimer', mail: 'malinatf2@gmail.com', gh: 'https://github.com/T3trix-hub' };
  const cur = location.pathname.split('/').pop() || 'index.html';
  const sun = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>';

  const hd = $('#site-header');
  if (hd) {
    hd.innerHTML = `<div class="wrap"><div class="bar"><a class="logo" href="index.html"><i class="mk"></i>Lexey</a><nav id="nav">${NAV.map(n => `<a href="${n[0]}"${n[0] === cur ? ' class="on"' : ''}>${n[1]}</a>`).join('')}</nav><button id="theme" aria-label="Сменить тему">${sun}${moon}</button><button id="burger" aria-label="Меню"><i></i><i></i><i></i></button></div></div>`;
    $('#burger').onclick = () => $('#nav').classList.toggle('open');
    $('#theme').onclick = () => { const r = document.documentElement, t = r.dataset.theme === 'dark' ? 'light' : 'dark'; r.dataset.theme = t; try { localStorage.setItem('theme', t); } catch (e) {} };
  }
  const ft = $('#site-footer');
  if (ft) ft.innerHTML = `<div class="wrap"><div class="foot"><div><b>Lexey</b>Алексей, веб-разработчик из Беларуси. Делаю сайты для заведений и бизнеса, интерактивные страницы и Telegram-ботов.</div><div><b>Разделы</b>${NAV.map(n => `<a href="${n[0]}">${n[1]}</a>`).join('<br>')}</div><div><b>Связь</b><a href="${C.tg}" target="_blank" rel="noopener">Telegram</a><br><a href="mailto:${C.mail}">${C.mail}</a><br><a href="${C.gh}" target="_blank" rel="noopener">GitHub</a></div></div><div class="copy">© 2026 Lexey. Все права защищены.</div></div>`;

  // статистика
  const live = P.filter(p => p.live).length;
  $$('[data-stat="projects"]').forEach(e => e.textContent = P.length);
  $$('[data-stat-label="projects"]').forEach(e => e.textContent = plural(P.length, 'готовый проект', 'готовых проекта', 'готовых проектов') + ' в портфолио');
  $$('[data-stat="live"]').forEach(e => e.textContent = live);
  const pad = n => String(n).padStart(2, '0');
  const tags = p => `<ul class="tags">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
  const short = p => p.short || ((p.desc || '').length > 150 ? p.desc.slice(0, 147) + '…' : (p.desc || ''));

  const act = p => `<div class="pa">${safeUrl(p.live) ? `<a class="live" href="${safeUrl(p.live)}" target="_blank" rel="noopener">Открыть сайт</a>` : ''}${safeUrl(p.repo) ? `<a href="${safeUrl(p.repo)}" target="_blank" rel="noopener">Исходный код</a>` : ''}${safeUrl(p.tg) ? `<a href="${safeUrl(p.tg)}" target="_blank" rel="noopener">Открыть бота</a>` : ''}</div>`;
  const pj = (p, full) => `<article class="pj"><div class="shot"><span class="sf">${esc((p.title || '?')[0])}</span><img src="images/projects/${esc(p.id)}.jpg" alt="Скриншот сайта: ${esc(p.title)}" loading="lazy" onerror="this.remove()"></div><div class="pb"><h3>${esc(p.title)}</h3><p>${esc(full ? p.desc : short(p))}</p>${tags(p)}${act(p)}</div></article>`;
  const fe = $('#featured');
  if (fe) { let f = P.filter(p => p.featured); if (!f.length) f = P.slice(0, 4); fe.innerHTML = f.slice(0, 4).map(p => pj(p, false)).join(''); }
  const pl = $('#projects-list');
  if (pl) pl.innerHTML = P.map(p => pj(p, true)).join('');

  // плавное появление
  if (!hd) return;
  $$('main h1,main h2,.b,.pj,.cc,.faq details').forEach(e => e.classList.add('rv'));
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { const t = x.target; t.classList.add('in'); io.unobserve(t); setTimeout(() => t.style.transitionDelay = '', 900); } }), { threshold: .08 }) : null;
  let i = 0; $$('.rv').forEach(e => { if (!io) return e.classList.add('in'); e.style.transitionDelay = Math.min(i++ % 6, 5) * 60 + 'ms'; io.observe(e); });
  document.addEventListener('click', e => { const a = e.target.closest('a[href]'); if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; const u = new URL(a.href, location.href); if (u.origin !== location.origin || u.pathname === location.pathname || !/\.html?$|\/$/.test(u.pathname)) return; e.preventDefault(); document.body.classList.add('leave'); setTimeout(() => location.href = a.href, 200); });
  addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('leave'); });
})();
