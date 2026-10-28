'use strict';

/* ==========================================================
   ТехноМастер — скрипт сайта
   1. НАСТРОЙКИ И ДАННЫЕ (меняйте здесь)
   2. Вспомогательные функции
   3. Отрисовка и логика разделов
   ========================================================== */

/* ---------- 1. НАСТРОЙКИ ---------- */
const WA_PLACEHOLDER = '996000000000';

const CONFIG = {
  company: 'ТехноМастер',
  // Номер WhatsApp: только цифры, с кодом страны, без «+». Пример: 996555123456
  whatsapp: '996707217977',
  phone: '+996 707 217 977',
  email: 'ormonkulaza@gmail.com',
  address: 'г. Манас, ул. Тумонбай Байзаков, 51 г',
  hours: 'Пн–Сб: 09:00–19:00, Вс: выходной',
  // Ссылка для встраивания карты (Google Maps → «Поделиться» → «Встроить карту» → src). Пусто — карта не показывается.
  mapEmbedUrl: 'https://maps.google.com/maps?q=40.9357844,72.9700018&z=17&output=embed',
  currency: 'сом',
  waGreeting: 'Здравствуйте! Хочу узнать стоимость ремонта техники. Подскажите, пожалуйста, как можно записаться на диагностику?'
};

/* Категории каталога и галереи */
const CATEGORIES = [
  { id: 'phone', name: 'Смартфоны',          icon: 'phone',  device: 'phone' },
  { id: 'pc',    name: 'Ноутбуки и ПК',      icon: 'laptop', device: 'laptop' },
  { id: 'tv',    name: 'Телевизоры',         icon: 'tv',     device: 'tv' },
  { id: 'home',  name: 'Бытовая техника',    icon: 'washer', device: 'appliance' },
  { id: 'game',  name: 'Приставки и т.п.', icon: 'game',   device: 'console' },
  { id: 'extra', name: 'Дополнительно',      icon: 'tool',   device: 'other' }
];

/* Услуги: [категория, название, описание, цена «от», сом, фото] — цены демонстрационные */
const SERVICES = [
  ['phone', 'Замена экрана', 'Новый дисплей с установкой и проверкой сенсора.', 1500, 'images/svc-display.jpg'],
  ['phone', 'Замена аккумулятора', 'Если телефон быстро разряжается или выключается.', 2000, 'images/phone-2.jpg'],
  ['phone', 'Ремонт разъёма зарядки', 'Телефон не заряжается или плохо держит кабель.', 800, 'images/svc-connector.jpg'],
  ['phone', 'Восстановление после влаги', 'Чистка платы и замена повреждённых элементов.', 1200, 'images/svc-water.jpg'],
  ['phone', 'Ремонт кнопок и камер', 'Не работают кнопки, камера или вспышка.', 700, 'images/svc-camera.jpg'],
  ['pc', 'Установка Windows и программ', 'Чистая система, драйверы и нужные программы.', 700, 'images/svc-windows.jpg'],
  ['pc', 'Чистка от пыли', 'Разборка, чистка кулера и радиаторов.', 1000, 'images/svc-dust.jpg'],
  ['pc', 'Замена термопасты', 'Помогает при перегреве и шуме вентилятора.', 500, 'images/svc-paste.jpg'],
  ['pc', 'Ремонт клавиатуры', 'Не работают клавиши или залита клавиатура.', 900, 'images/svc-keyboard.jpg'],
  ['pc', 'Замена SSD и оперативной памяти', 'Ускорение старого ноутбука или компьютера.', 600, 'images/svc-ssd.jpg'],
  ['pc', 'Устранение вирусов', 'Удаляем вредоносные программы и рекламу.', 600, 'images/svc-virus.jpg'],
  ['tv', 'Диагностика неисправностей', 'Определяем причину, прежде чем называть цену.', 300, 'images/svc-stethoscope.jpg'],
  ['tv', 'Ремонт подсветки', 'Экран тёмный, но звук есть.', 3500, 'images/svc-backlight.jpg'],
  ['tv', 'Ремонт блока питания', 'Телевизор не включается или щёлкает.', 3500, 'images/svc-psu.jpg'],
  ['tv', 'Проблемы с изображением', 'Полосы, пятна, нет картинки.', 3500, 'images/svc-tv-stripes.jpg'],
  ['home', 'Ремонт стиральных машин', 'Не сливает, не отжимает, шумит, не включается.', 2500, 'images/svc-washer.jpg'],
  ['home', 'Ремонт холодильников', 'Плохо морозит, шумит или не включается.', 1500, 'images/svc-fridge.jpg'],
  ['home', 'Ремонт микроволновых печей', 'Не греет, искрит или не запускается.', 800, 'images/svc-microwave.jpg'],
  ['home', 'Ремонт пылесосов', 'Слабая тяга, шум, не включается.', 700, 'images/svc-vacuum.jpg'],
  ['home', 'Ремонт электрических чайников', 'Не включается или не отключается.', 500, 'images/svc-kettle.jpg'],
  ['game', 'Ремонт игровых приставок', 'Не включается, нет изображения, ошибки.', 1500, 'images/svc-console.jpg'],
  ['game', 'Чистка игровых консолей', 'Удаляем пыль и меняем термопасту.', 900, 'images/svc-console-board.jpg'],
  ['game', 'Ремонт контроллеров', 'Дрейф стиков, залипание кнопок.', 700, 'images/svc-gamepad.jpg'],
  ['game', 'Устранение перегрева', 'Консоль шумит и выключается во время игры.', 1000, 'images/svc-overheat.jpg'],
  ['extra', 'Выезд мастера', 'Мастер приедет к вам домой или в офис.', 300, 'images/svc-visit.jpg'],
  ['extra', 'Диагностика', 'Проверяем устройство и называем стоимость ремонта.', 300, 'images/svc-diagnostics.jpg'],
  ['extra', 'Установка программ', 'Настроим нужные программы и сервисы.', 400, 'images/svc-apps.jpg'],
  ['extra', 'Профилактическое обслуживание', 'Чистка и проверка до того, как случится поломка.', 800, 'images/svc-service.jpg']
].map(([cat, title, desc, price, img]) => ({ cat, title, desc, price, img }));

/* Прайс-лист (демонстрационные цены) */
const PRICES = [
  { name: 'Диагностика', price: 300 },
  { name: 'Чистка ноутбука', price: 1000 },
  { name: 'Установка Windows', price: 700 },
  { name: 'Замена аккумулятора смартфона', price: 2000 },
  { name: 'Ремонт разъёма зарядки', price: 800 },
  { name: 'Ремонт телевизора', price: 3500 },
  { name: 'Ремонт стиральной машины', price: 2500 }
];

/* Калькулятор: все цены в одном объекте (сом) */
const CALC = {
  devices: {
    phone: { label: 'Смартфон', faults: [
      { id: 'screen', label: 'Разбит экран', price: 1500 },
      { id: 'battery', label: 'Быстро разряжается', price: 2000 },
      { id: 'charge', label: 'Не заряжается', price: 800 },
      { id: 'water', label: 'Попала вода', price: 1200 },
      { id: 'camera', label: 'Не работает камера или кнопка', price: 700 }
    ] },
    laptop: { label: 'Ноутбук / компьютер', faults: [
      { id: 'os', label: 'Не загружается или тормозит Windows', price: 700 },
      { id: 'heat', label: 'Перегревается и шумит', price: 1000 },
      { id: 'keys', label: 'Не работает клавиатура', price: 900 },
      { id: 'ssd', label: 'Нужен SSD или больше памяти', price: 600 },
      { id: 'virus', label: 'Вирусы и всплывающая реклама', price: 600 }
    ] },
    tv: { label: 'Телевизор', faults: [
      { id: 'noimg', label: 'Нет изображения', price: 3500 },
      { id: 'light', label: 'Тёмный экран (подсветка)', price: 3500 },
      { id: 'power', label: 'Не включается', price: 3500 },
      { id: 'unknown', label: 'Не знаю, нужна диагностика', price: 300 }
    ] },
    appliance: { label: 'Бытовая техника', faults: [
      { id: 'washer', label: 'Стиральная машина', price: 2500 },
      { id: 'fridge', label: 'Холодильник', price: 1500 },
      { id: 'micro', label: 'Микроволновая печь', price: 800 },
      { id: 'vacuum', label: 'Пылесос', price: 700 },
      { id: 'kettle', label: 'Электрический чайник', price: 500 }
    ] },
    console: { label: 'Игровая приставка', faults: [
      { id: 'heat', label: 'Перегрев и шум', price: 1000 },
      { id: 'clean', label: 'Нужна чистка', price: 900 },
      { id: 'pad', label: 'Неисправен контроллер', price: 700 },
      { id: 'boot', label: 'Не включается', price: 1500 }
    ] }
  },
  extras: [
    { id: 'visit', label: 'Выезд мастера', price: 300 },
    { id: 'diag', label: 'Углублённая диагностика', price: 300 },
    { id: 'soft', label: 'Установка программ', price: 400 },
    { id: 'care', label: 'Профилактическое обслуживание', price: 800 }
  ]
};

/* Типы техники в форме заявки */
const DEVICE_TYPES = [
  { id: 'phone', label: 'Смартфон' }, { id: 'laptop', label: 'Ноутбук' },
  { id: 'pc', label: 'Компьютер' }, { id: 'tv', label: 'Телевизор' },
  { id: 'appliance', label: 'Бытовая техника' }, { id: 'console', label: 'Игровая приставка' },
  { id: 'other', label: 'Другое' }
];

/* Галерея. src — путь к вашему фото (например 'images/work1.jpg'). Если файла нет, показывается демонстрационная иллюстрация. */
const GALLERY = [
  { cat: 'phone', title: 'Замена экрана смартфона', src: 'images/phone-1.jpg' },
  { cat: 'phone', title: 'Замена аккумулятора', src: 'images/phone-2.jpg' },
  { cat: 'pc', title: 'Чистка ноутбука и замена термопасты', src: 'images/laptop-1.jpg' },
  { cat: 'pc', title: 'Установка SSD', src: 'images/laptop-2.jpg' },
  { cat: 'tv', title: 'Ремонт подсветки телевизора', src: 'images/tv-1.jpg' },
  { cat: 'tv', title: 'Диагностика блока питания', src: 'images/tv-2.jpg' },
  { cat: 'home', title: 'Ремонт стиральной машины', src: 'images/svc-washer.jpg' },
  { cat: 'home', title: 'Ремонт микроволновой печи', src: 'images/svc-microwave.jpg' }
];

/* Отзывы — ДЕМОНСТРАЦИОННЫЕ примеры. Замените реальными отзывами клиентов. */
const REVIEWS = [
  { name: 'Имя клиента', device: 'Смартфон', text: 'Пример отзыва. Здесь будет текст реального отзыва о ремонте смартфона.' },
  { name: 'Имя клиента', device: 'Ноутбук', text: 'Пример отзыва. Здесь будет текст реального отзыва о ремонте ноутбука.' },
  { name: 'Имя клиента', device: 'Телевизор', text: 'Пример отзыва. Здесь будет текст реального отзыва о ремонте телевизора.' }
];

/* Иконки (viewBox 24x24, линии) */
const ICONS = {
  phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18.5h2"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 20h20"/>',
  tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  washer: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><circle cx="12" cy="13.5" r="4"/><path d="M8 6h.01M11 6h.01"/>',
  game: '<path d="M6 8h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.2 2L15 13H9l-1.8 2A3 3 0 0 1 2 13v-1a4 4 0 0 1 4-4z"/><path d="M8 10.5v2M7 11.5h2M16 11h.01M18 12.5h.01"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3.5 17.2a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.1-5.4l-2.4 2.4-2.4-.7-.7-2.4z"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.2-4.2"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
  box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  pin: '<path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  phoneCall: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'
};

/* ---------- 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Экранирование: всё, что вставляется через innerHTML, проходит через esc() */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const money = (n) => new Intl.NumberFormat('ru-RU').format(n) + '\u00a0' + CONFIG.currency;
const icon = (name) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
const catById = (id) => CATEGORIES.find((c) => c.id === id);

const waReady = () => /^\d{10,15}$/.test(CONFIG.whatsapp) && CONFIG.whatsapp !== WA_PLACEHOLDER;
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

/* Уведомления */
function toast(message) {
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  box.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

/* Привязка ссылок WhatsApp: элементы с атрибутом data-wa */
function bindWa(root = document) {
  $$('[data-wa]', root).forEach((a) => {
    a.href = waLink(a.dataset.wa || CONFIG.waGreeting);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });
}
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-wa]');
  if (link && !waReady()) {
    e.preventDefault();
    toast('Номер WhatsApp ещё не настроен. Владелец сайта должен указать его в CONFIG (script.js).');
  }
});

/* Перейти к форме заявки с предзаполнением */
function goToOrder({ device, issue }) {
  if (device) $('#f-device').value = device;
  if (issue) $('#f-issue').value = issue;
  $('#order').scrollIntoView();
  setTimeout(() => $('#f-name').focus({ preventScroll: true }), 400);
  saveDraft();
  toast('Форма заявки подготовлена — заполните остальные поля.');
}

/* ---------- 3. РАЗДЕЛЫ ---------- */

/* Иконки, контакты, год */
function initStatic() {
  $$('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
  $('.js-address').textContent = CONFIG.address;
  $('.js-hours').textContent = CONFIG.hours;
  const ph = $('.js-phone'); ph.textContent = CONFIG.phone; ph.href = 'tel:' + CONFIG.phone.replace(/[^\d+]/g, '');
  const ml = $('.js-mail'); ml.textContent = CONFIG.email; ml.href = 'mailto:' + CONFIG.email;
  $('#year').textContent = new Date().getFullYear();

  // Фото мастера: если images/master.jpg существует, оно заменяет иллюстрацию
  const hp = $('#heroPhoto');
  hp.addEventListener('load', () => { hp.hidden = false; $$('.hero-visual svg, .float-chip').forEach((el) => { el.hidden = true; el.style.display = 'none'; }); });
  hp.src = 'images/master.jpg';

  const map = $('#mapBox');
  if (CONFIG.mapEmbedUrl) {
    const f = document.createElement('iframe');
    f.src = CONFIG.mapEmbedUrl; f.title = 'Карта: расположение сервисного центра'; f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    map.textContent = ''; map.style.padding = '0'; map.appendChild(f);
  } else {
    map.textContent = 'Карта появится, когда вы укажете реальный адрес: вставьте ссылку для встраивания в CONFIG.mapEmbedUrl (script.js).';
  }
}

/* Мобильное меню */
function initMenu() {
  const btn = $('#menuToggle'), nav = $('#nav');
  const set = (open) => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); } });
}

/* Каталог: фильтр + поиск */
const catalogState = { cat: 'all', q: '' };

function renderCatalog() {
  const q = catalogState.q.trim().toLowerCase();
  const list = SERVICES.map((s, i) => ({ ...s, i })).filter((s) =>
    (catalogState.cat === 'all' || s.cat === catalogState.cat) &&
    (!q || (s.title + ' ' + s.desc).toLowerCase().includes(q)));

  $('#catalog').innerHTML = list.map((s) => {
    const c = catById(s.cat);
    const msg = `Здравствуйте! Интересует услуга «${s.title}». Подскажите, пожалуйста, стоимость и сроки.`;
    return `<article class="svc">
      <div class="svc-media m-${esc(s.cat)}">${icon(c.icon)}${s.img ? `<img src="${esc(s.img)}" alt="${esc(s.title)}" loading="lazy">` : ''}</div>
      <div class="svc-body">
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        <p class="svc-price">от ${money(s.price)}</p>
        <div class="svc-actions">
          <button class="btn btn--navy btn--sm" type="button" data-order="${s.i}">Заказать</button>
          <a class="btn btn--line btn--sm" href="#contacts" data-wa="${esc(msg)}">WhatsApp</a>
        </div>
      </div></article>`;
  }).join('');

  bindWa($('#catalog'));
  $('#noResults').hidden = list.length > 0;
  $('#resultCount').textContent = list.length ? `Найдено услуг: ${list.length}` : '';
}

function initCatalog() {
  const box = $('#filters');
  const all = [{ id: 'all', name: 'Все услуги' }, ...CATEGORIES];
  box.innerHTML = all.map((c) => `<button type="button" class="chip-btn" data-filter="${esc(c.id)}" aria-pressed="${c.id === 'all'}">${esc(c.name)}</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]'); if (!b) return;
    catalogState.cat = b.dataset.filter;
    $$('[data-filter]', box).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderCatalog();
  });
  $('#search').addEventListener('input', (e) => { catalogState.q = e.target.value; renderCatalog(); });
  // Если фото услуги не найдено — остаётся значок категории
  $('#catalog').addEventListener('error', (e) => { if (e.target.tagName === 'IMG') e.target.remove(); }, true);
  $('#catalog').addEventListener('click', (e) => {
    const b = e.target.closest('[data-order]'); if (!b) return;
    const s = SERVICES[Number(b.dataset.order)];
    goToOrder({ device: catById(s.cat).device, issue: 'Услуга: ' + s.title });
  });
  renderCatalog();
}

/* Прайс-лист */
function initPrices() {
  $('#priceBody').innerHTML = PRICES.map((p) => `<tr><th scope="row">${esc(p.name)}</th><td>от ${money(p.price)}</td></tr>`).join('');
}

/* Калькулятор */
const calcResult = { device: 'phone', text: '' };

function initCalc() {
  const dev = $('#calcDevice'), fault = $('#calcFault'), extras = $('#calcExtras');
  dev.innerHTML = Object.entries(CALC.devices).map(([k, d]) => `<option value="${esc(k)}">${esc(d.label)}</option>`).join('');
  extras.innerHTML = CALC.extras.map((x) => `<label class="check"><input type="checkbox" value="${esc(x.id)}"><span>${esc(x.label)}</span><b>+${money(x.price)}</b></label>`).join('');

  const fillFaults = () => {
    fault.innerHTML = CALC.devices[dev.value].faults.map((f) => `<option value="${esc(f.id)}">${esc(f.label)} — от ${money(f.price)}</option>`).join('');
  };
  const update = () => {
    const d = CALC.devices[dev.value];
    const f = d.faults.find((x) => x.id === fault.value) || d.faults[0];
    const chosen = CALC.extras.filter((x) => $(`input[value="${x.id}"]`, extras).checked);
    const total = f.price + chosen.reduce((sum, x) => sum + x.price, 0);
    $('#calcTotal').textContent = 'от ' + money(total);
    $('#calcBreakdown').innerHTML = [`<li><span>${esc(f.label)}</span><span>${money(f.price)}</span></li>`]
      .concat(chosen.map((x) => `<li><span>${esc(x.label)}</span><span>${money(x.price)}</span></li>`)).join('');
    calcResult.device = dev.value;
    calcResult.text = `${f.label}` + (chosen.length ? `. Дополнительно: ${chosen.map((x) => x.label).join(', ')}` : '') + `. Предварительная оценка калькулятора: от ${total} ${CONFIG.currency}.`;
  };

  dev.addEventListener('change', () => { fillFaults(); update(); });
  fault.addEventListener('change', update);
  extras.addEventListener('change', update);
  $('#calcOrder').addEventListener('click', () => goToOrder({ device: calcResult.device, issue: calcResult.text }));
  fillFaults(); update();
}

/* Галерея и увеличенный просмотр */
function artUri(iconName, c1, c2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="650" cy="90" r="180" fill="#fff" fill-opacity=".07"/><circle cx="110" cy="530" r="140" fill="#fff" fill-opacity=".07"/><g transform="translate(250 150) scale(12.5)" fill="none" stroke="#fff" stroke-opacity=".92" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round">${ICONS[iconName]}</g></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
const ART_COLORS = { phone: ['#0f2a5a', '#19a0ff'], pc: ['#16407f', '#4cc3ff'], tv: ['#0a1e3f', '#2b7de0'], home: ['#123a78', '#12b4e6'] };

function initGallery() {
  const cats = CATEGORIES.slice(0, 4);
  const state = { cat: 'all' };
  const filters = $('#galFilters'), grid = $('#gallery');
  filters.innerHTML = [{ id: 'all', name: 'Все работы' }, ...cats].map((c) => `<button type="button" class="chip-btn" data-gal="${esc(c.id)}" aria-pressed="${c.id === 'all'}">${esc(c.name)}</button>`).join('');

  const render = () => {
    grid.innerHTML = GALLERY.map((g, i) => ({ g, i })).filter(({ g }) => state.cat === 'all' || g.cat === state.cat).map(({ g, i }) => {
      const c = catById(g.cat), col = ART_COLORS[g.cat] || ART_COLORS.phone;
      const src = g.src || artUri(c.icon, col[0], col[1]);
      return `<button class="gal-item" type="button" data-img="${i}" aria-label="Открыть: ${esc(g.title)}"><img src="${esc(src)}" data-fb="${esc(artUri(c.icon, col[0], col[1]))}" alt="${esc(g.title)}" loading="lazy"><span>${esc(g.title)}</span></button>`;
    }).join('');
  };
  // Если фото не найдено — подставляем иллюстрацию
  grid.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName === 'IMG' && img.dataset.fb && img.src !== img.dataset.fb) img.src = img.dataset.fb;
  }, true);
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('[data-gal]'); if (!b) return;
    state.cat = b.dataset.gal;
    $$('[data-gal]', filters).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  });

  const lb = $('#lightbox');
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-img]'); if (!b) return;
    const img = $('img', b);
    $('#lbImg').src = img.src; $('#lbImg').alt = img.alt; $('#lbCap').textContent = img.alt;
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  });
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  render();
}

/* Отзывы */
function initReviews() {
  $('#reviews').innerHTML = REVIEWS.map((r) => `<article class="rev reveal"><blockquote>${esc(r.text)}</blockquote><footer><span><strong>${esc(r.name)}</strong><br><small>${esc(r.device)}</small></span><span class="badge">Пример для замены</span></footer></article>`).join('');
}

/* Форма заявки */
const form = () => $('#orderForm');
const DRAFT_KEY = 'tm_order_draft';
const FIELDS = ['name', 'phone', 'device', 'model', 'issue', 'date', 'mode'];

const todayStr = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };

/* Приводит номер к виду +996XXXXXXXXX; пустая строка — номер неверный */
function normPhone(v) {
  if (!/^[\d\s+\-()]+$/.test(v)) return '';
  let d = v.replace(/\D/g, '');
  if (d.length === 9) d = '996' + d;
  else if (d.length === 10 && d[0] === '0') d = '996' + d.slice(1);
  return /^996[1-9]\d{8}$/.test(d) ? '+' + d : '';
}

const VALIDATORS = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Введите имя — минимум 2 символа.'),
  phone: (v) => (!v.trim() ? 'Введите номер телефона.' : normPhone(v) ? '' : 'Проверьте номер. Пример: +996 555 123 456 или 0555 123 456.'),
  device: (v) => (v ? '' : 'Выберите тип техники.'),
  model: (v) => (v.trim().length >= 2 ? '' : 'Укажите производителя и модель, например «Samsung A54».'),
  issue: (v) => (v.trim().length >= 5 ? '' : 'Опишите неисправность хотя бы в нескольких словах.'),
  date: (v) => (!v ? 'Выберите удобную дату.' : v < todayStr() ? 'Дата не может быть в прошлом.' : ''),
  mode: (v) => (v ? '' : 'Выберите способ обслуживания.')
};

function getValue(name) {
  if (name === 'mode') { const r = $('input[name="mode"]:checked', form()); return r ? r.value : ''; }
  return form().elements[name].value;
}

function validateField(name) {
  const msg = VALIDATORS[name](getValue(name));
  $('#err-' + name).textContent = msg;
  if (name !== 'mode') form().elements[name].setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
}

/* Черновик — только с согласия пользователя */
function saveDraft() {
  try {
    if (!$('#draftConsent').checked) { localStorage.removeItem(DRAFT_KEY); return; }
    const data = { consent: true };
    FIELDS.forEach((n) => { data[n] = getValue(n); });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (e) { /* хранилище недоступно — это не ошибка */ }
}
function loadDraft() {
  try {
    const data = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (!data || !data.consent) return;
    $('#draftConsent').checked = true;
    FIELDS.forEach((n) => {
      if (n === 'mode') { const r = $(`input[name="mode"][value="${CSS.escape(data.mode || 'service')}"]`); if (r) r.checked = true; }
      else if (typeof data[n] === 'string') form().elements[n].value = data[n];
    });
  } catch (e) { /* повреждённый черновик игнорируем */ }
}

function buildMessage() {
  const deviceLabel = (DEVICE_TYPES.find((d) => d.id === getValue('device')) || {}).label || '';
  const mode = getValue('mode') === 'visit' ? 'Выезд мастера' : 'В сервисе';
  const date = getValue('date').split('-').reverse().join('.');
  return [
    'Здравствуйте! Хочу оставить заявку на ремонт.',
    'Имя: ' + getValue('name').trim(),
    'Телефон: ' + normPhone(getValue('phone')),
    'Техника: ' + deviceLabel,
    'Модель: ' + getValue('model').trim(),
    'Неисправность: ' + getValue('issue').trim(),
    'Удобная дата: ' + date,
    'Обслуживание: ' + mode
  ].join('\n');
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* пробуем запасной способ */ }
  try {
    const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select(); const ok = document.execCommand('copy'); t.remove(); return ok;
  } catch (e) { return false; }
}

function initForm() {
  const f = form();
  const sel = $('#f-device');
  sel.innerHTML = '<option value="">Выберите…</option>' + DEVICE_TYPES.map((d) => `<option value="${esc(d.id)}">${esc(d.label)}</option>`).join('');
  $('#f-date').min = todayStr();
  loadDraft();

  FIELDS.forEach((n) => {
    const els = n === 'mode' ? $$('input[name="mode"]', f) : [f.elements[n]];
    els.forEach((el) => {
      el.addEventListener('blur', () => { if (n !== 'mode') validateField(n); });
      el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validateField(n); });
    });
  });
  f.addEventListener('input', saveDraft);
  f.addEventListener('change', saveDraft);

  let afterSubmit = false; // true, когда форма очищается после отправки (результат скрывать не нужно)
  f.addEventListener('reset', () => {
    const keepResult = afterSubmit; afterSubmit = false;
    setTimeout(() => {
      $$('.error', f).forEach((p) => { p.textContent = ''; });
      $$('[aria-invalid]', f).forEach((el) => el.setAttribute('aria-invalid', 'false'));
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ничего */ }
      if (!keepResult) $('#formResult').hidden = true;
    });
  });

  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = FIELDS.filter((n) => !validateField(n));
    if (bad.length) {
      const first = bad[0] === 'mode' ? $('input[name="mode"]', f) : f.elements[bad[0]];
      first.focus();
      toast('Проверьте поля формы: ' + bad.length + ' требуют исправления.');
      return;
    }
    const text = buildMessage();
    const url = waLink(text);
    const res = $('#formResult');
    $('#resultText').textContent = text;
    const link = $('#resultLink'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    $('#resultHint').textContent = waReady()
      ? 'Сообщение готово. Мастер получит его, когда вы отправите его в WhatsApp. Если окно не открылось, нажмите кнопку ниже.'
      : 'Номер WhatsApp сервиса ещё не настроен, поэтому сообщение не открыто автоматически. Скопируйте текст и отправьте его мастеру любым способом.';
    res.hidden = false;
    res.focus();
    if (waReady()) window.open(url, '_blank', 'noopener');
    toast('Заявка подготовлена.');
    try { localStorage.removeItem(DRAFT_KEY); } catch (err) { /* ничего */ }
    afterSubmit = true;
    f.reset();
  });

  $('#resultLink').addEventListener('click', (e) => {
    if (!waReady()) { e.preventDefault(); toast('Номер WhatsApp не настроен. Скопируйте текст кнопкой ниже.'); }
  });
  $('#copyBtn').addEventListener('click', async () => {
    toast((await copyText($('#resultText').textContent)) ? 'Текст заявки скопирован.' : 'Не удалось скопировать. Выделите текст вручную.');
  });
}

/* Кнопка «Наверх», появление блоков при прокрутке */
function initScrollUi() {
  const top = $('#toTop');
  const onScroll = () => top.classList.toggle('show', window.scrollY > 600);
  window.addEventListener('scroll', onScroll, { passive: true });
  top.addEventListener('click', () => window.scrollTo({ top: 0 }));
  onScroll();

  const items = $$('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('in')); return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

/* Запуск */
document.addEventListener('DOMContentLoaded', () => {
  initReviews();   // создаёт .reveal-элементы до наблюдателя
  initStatic();
  initMenu();
  initCatalog();
  initPrices();
  initCalc();
  initGallery();
  initForm();
  bindWa();
  initScrollUi();
});
