import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { flushSync } from 'react-dom';
import './app.css';
const photo = "/photo.jpg";

const REDUCED = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
};

/* ---------- data and text: edit here ---------- */
var EMAIL = 'odiljonovism2010@icloud.com';
var SOCIALS = [
  { id: 'telegram', name: 'Telegram', handle: '@odiljonov_041', url: 'https://t.me/odiljonov_041', icon: 'send' },
  { id: 'github', name: 'GitHub', handle: 'odiljonovism2010', url: 'https://github.com/odiljonovism2010', icon: 'github' },
  { id: 'instagram', name: 'Instagram', handle: '@odiljonov_ismoiljon', url: 'https://www.instagram.com/odiljonov_ismoiljon', icon: 'insta' }
];
var STACK = ['HTML', 'CSS', 'JavaScript', 'React', 'Backend', 'REST API', 'Git', 'GitHub', 'VS Code', 'Responsive design'];
var BASE = [
  { id: 'portfolio', cat: 'site', year: 2026, v: 0, stack: ['React', 'CSS', 'JavaScript'] },
  { id: 'todo', cat: 'app', year: 2026, v: 1, stack: ['React', 'localStorage'] },
  { id: 'weather', cat: 'app', year: 2025, v: 2, stack: ['JavaScript', 'REST API'] },
  { id: 'landing', cat: 'site', year: 2025, v: 3, stack: ['HTML', 'CSS'] },
  { id: 'shop', cat: 'site', year: 2026, v: 4, stack: ['React', 'CSS'] },
  { id: 'api', cat: 'backend', year: 2026, v: 5, stack: ['Backend', 'REST API', 'Git'] }
];

function pl(n, w) { var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? w[0] : (a >= 2 && a <= 4 && (b < 10 || b >= 20) ? w[1] : w[2]); }

/* ---------- text: edit here ---------- */
var I = {
  uz: {
    nav: [['about', 'Men haqimda'], ['services', 'Xizmatlar'], ['work', 'Loyihalar'], ['skills', 'Ko‘nikmalar'], ['path', 'Ta’lim'], ['faq', 'Savollar'], ['contact', 'Aloqa']],
    name: ['Ismoiljon', 'Odiljonov'],
    roles: ['Full Stack dasturchi', 'Frontend dasturchi', 'React dasturchi', 'Backend o‘rganmoqda'],
    status: 'Loyiha va amaliyotga ochiqman',
    lead: 'Men 16 yoshdaman, IT TAT markazida o‘qiyman va ikki yildan beri kod yozaman. HTML va CSS dan tortib React va server qismigacha veb-saytlar hamda ilovalar yarataman.',
    cta1: 'Loyihalarni ko‘rish', cta2: 'Menga yozing',
    photoAlt: 'Ismoiljon Odiljonov dasturchi stolida',
    stats: [[2, 'yil tajriba'], [5, 'o‘quv bosqichi'], [6, 'loyiha'], [10, 'texnologiya va vosita']],
    aboutLabel: 'Men haqimda', aboutTitle: 'Mahsulotni boshidan oxirigacha yaratishni o‘rganyapman',
    about: ['Men HTML va CSS dan JavaScript va React gacha yo‘l bosdim, hozir Backend ustida ishlayapman. Mahsulotning butun yo‘li qiziq: ekrandagi tugmadan serverdagi ma’lumotgacha.', 'IT TAT markazida o‘qiyman, ko‘p mashq qilaman va kodimni GitHub’ga joylayman. O‘sish va foyda keltirish mumkin bo‘lgan loyiha hamda jamoa izlayman.'],
    aboutFacts: [['Yosh', '16'], ['Tajriba', '2 yil'], ['O‘qish', 'IT TAT'], ['Texnologiyalar', 'HTML, CSS, JavaScript, React, Backend']],
    svcLabel: 'Xizmatlar', svcTitle: 'Sizga qanday yordam bera olaman',
    svc: [
      { i: 'layout', t: 'Veb-sayt', d: 'Vizitka, lending yoki portfolio: telefon va kompyuterga moslashgan, tez ochiladigan sahifalar.' },
      { i: 'code', t: 'Veb-ilova', d: 'React’da interaktiv ilovalar: ro‘yxatlar, filtrlar, formalar va ma’lumotlar bilan ishlash.' },
      { i: 'server', t: 'Backend va API', d: 'Ma’lumotlarni saqlash va uzatish uchun oddiy server va REST API. Hozir o‘rganish bosqichida.' },
      { i: 'zap', t: 'Saytni yaxshilash', d: 'Mavjud sahifani yangilash: dizaynni tartibga solish, mobil versiya va tezlik.' }
    ],
    workLabel: 'Loyihalar', workTitle: 'Nimalar yaratganman',
    searchPh: 'Loyiha yoki texnologiya qidirish', noRes: 'Hech narsa topilmadi. Boshqa so‘z yoki bo‘limni sinab ko‘ring.',
    filters: { all: 'Hammasi', app: 'Ilovalar', site: 'Saytlar', backend: 'Backend' },
    cnt: function (n) { return n + ' ta loyiha'; },
    kRole: 'Rol', kStack: 'Texnologiyalar', kLearn: 'Nimani o‘rgandim', kYear: 'Yil', learning: 'O‘quv loyiha', code: 'GitHub’da ko‘rish',
    open: 'Loyihani ochish', close: 'Yopish', prev: 'Oldingi loyiha', next: 'Keyingi loyiha',
    projects: {
      portfolio: { title: 'Mening portfoliom', kind: 'Shaxsiy sayt', role: 'Dizayn va dasturlash', summary: 'React’da bir sahifali sayt: filtrli loyihalar, qorong‘i va yorug‘ mavzu, uch til va aloqa brifi.', learn: 'Komponentlar, holat va moslashuvchan maket.' },
      todo: { title: 'To-Do', kind: 'Vazifalar ro‘yxati', role: 'Dasturlash', summary: 'Filtrli vazifalar ilovasi, ma’lumotlar brauzerda saqlanadi.', learn: 'React hook’lari va localStorage.' },
      weather: { title: 'Ob-havo', kind: 'Shahar bo‘yicha prognoz', role: 'Dasturlash', summary: 'Shaharni qidirish va ob-havo prognozi, ma’lumot tashqi API’dan keladi.', learn: 'API so‘rovlari va javobni JavaScript’da qayta ishlash.' },
      landing: { title: 'Lending', kind: 'Bir sahifali sayt', role: 'Maket', summary: 'Xizmatlar, fikrlar va ariza formasi bor moslashuvchan sahifa.', learn: 'Flexbox, Grid va moslashuvchanlik.' },
      shop: { title: 'Do‘kon', kind: 'Internet-do‘kon interfeysi', role: 'Dasturlash', summary: 'React’da mahsulotlar katalogi, kartochkalar va savat.', learn: 'Ro‘yxat ma’lumotlari va komponentlar bilan ishlash.' },
      api: { title: 'REST API', kind: 'Server qismi', role: 'Dasturlash', summary: 'Yozuvlarni yaratish, o‘qish, o‘zgartirish va o‘chirish uchun marshrutlari bor server.', learn: 'Backend asoslari va ma’lumotlar bilan ishlash.' }
    },
    skillsLabel: 'Ko‘nikmalar', skillsTitle: 'Nimalardan foydalanaman',
    skills: [
      { title: 'Frontend', items: [['HTML', '1-bosqich'], ['CSS', '2-bosqich'], ['JavaScript', '3-bosqich'], ['React', '4-bosqich']] },
      { title: 'Backend', items: [['Server qismi', '5-bosqich'], ['API', '5-bosqich'], ['Ma’lumotlar bazasi', '5-bosqich']] },
      { title: 'Vositalar', items: [['Git', ''], ['GitHub', ''], ['VS Code', '']] }
    ],
    pathLabel: 'Ta’lim · IT TAT', pathTitle: 'Dasturlashdagi yo‘lim',
    path: [
      { yrs: '1-bosqich', title: 'HTML', org: 'IT TAT', text: 'Sahifa tuzilishi, semantik teglar, formalar.' },
      { yrs: '2-bosqich', title: 'CSS', org: 'IT TAT', text: 'Maket, Flexbox, Grid, moslashuvchanlik va animatsiya.' },
      { yrs: '3-bosqich', title: 'JavaScript', org: 'IT TAT', text: 'Til asoslari, DOM, hodisalar, API so‘rovlari.' },
      { yrs: '4-bosqich', title: 'React', org: 'IT TAT', text: 'Komponentlar, holat, hook’lar va loyihani yig‘ish.' },
      { yrs: '5-bosqich', title: 'Backend', org: 'IT TAT', text: 'Server qismi, API va ma’lumotlar bazalari.' }
    ],
    faqLabel: 'Savollar', faqTitle: 'Ko‘p so‘raladigan savollar',
    faq: [
      ['Qaysi texnologiyalar bilan ishlaysiz?', 'HTML, CSS, JavaScript va React bilan veb-interfeys yarataman. Server qismi (Backend) ustida hozir o‘qiyapman va mashq qilyapman.'],
      ['Buyurtma qanday boshlanadi?', 'Aloqa bo‘limidagi qisqa brifni to‘ldiring va menga Telegram’da yuboring. Vazifani aniqlashtirib, bajarish rejasini aytaman.'],
      ['Qancha vaqt ketadi?', 'Muddat vazifa hajmiga bog‘liq. Brifni ko‘rgach, aniq muddatni birga kelishamiz.'],
      ['Sayt telefonda ham ishlaydimi?', 'Ha. Barcha sahifalarni telefon, planshet va kompyuter uchun moslashuvchan qilib yarataman.']
    ],
    contactLabel: 'Aloqa', contactTitle: 'Vazifa haqida yozing',
    contactText: 'O‘ngdagi qisqa brifni to‘ldiring. Xabar o‘zi tayyor bo‘ladi: uni nusxalab Telegram’da yoki pochta orqali yuboring.',
    briefName: 'Ism', briefEmail: 'Email manzilingiz', briefType: 'Nima kerak', briefBudget: 'Byudjet', briefMsg: 'Vazifa haqida yozing',
    namePh: 'Sizga qanday murojaat qilay', msgPh: 'Qanday loyiha, kim uchun, qaysi muddatgacha',
    types: ['Veb-sayt', 'Veb-ilova', 'Dizayn', 'Boshqa'],
    budgets: ['Hali bilmayman', '$100 gacha', '$100–500', '$500 dan yuqori'],
    previewLabel: 'Tayyor xabar', copy: 'Xabarni nusxalash', mail: 'Pochtada ochish', tg: 'Telegram’da yozish',
    copied: 'Nusxalandi. Matnni Telegram yoki pochtaga qo‘ying.', copyFail: 'Avtomatik nusxalanmadi. Matn belgilandi, Ctrl+C bosing.',
    mailNote: 'Pochta tugmasi hamma joyda ishlamaydi. Manzilni nusxalab olishingiz mumkin.', copyMail: 'Manzilni nusxalash',
    errEmail: 'Email’ni name@example.com ko‘rinishida kiriting', errMsg: 'Vazifani kamida bir-ikki so‘z bilan yozing',
    brief: function (f) { return 'Assalomu alaykum, Ismoiljon!\nMening ismim ' + (f.name || '…') + '.\n\nVazifa: ' + f.type + '.\nByudjet: ' + f.budget + '.\n\n' + (f.msg || '…') + '\n\nJavob uchun email: ' + (f.email || '…'); },
    subject: 'Yangi loyiha',
    palPh: 'Buyruq yoki bo‘lim nomini yozing', palNone: 'Hech narsa topilmadi', palOpen: 'Buyruqlar', palGo: 'Bo‘lim', palAct: 'Amal', palLink: 'Havola',
    cmdTheme: 'Mavzuni almashtirish', cmdCopyMail: 'Email manzilni nusxalash', cmdTop: 'Tepaga qaytish',
    foot: 'React’da yaratilgan', top: 'Tepaga', theme: 'Mavzuni almashtirish', lang: 'Til', skip: 'Asosiy tarkibga o‘tish',
    toastTheme: 'Mavzu almashtirildi', toastMail: 'Email manzil nusxalandi', cv: 'CV yuklab olish', toastCV: 'CV yuklab olindi', share: 'Ulashish', toastShare: 'Havola nusxalandi', sortLbl: 'Saralash', sorts: ['Yangilari birinchi', 'Eskilari birinchi', 'Nomi bo‘yicha'], viewList: 'Ro‘yxat', viewGrid: 'Kartochkalar', keysHint: 'T — mavzu · L — til · / — qidiruv · Esc — yopish'
  },
  ru: {
    nav: [['about', 'Обо мне'], ['services', 'Услуги'], ['work', 'Проекты'], ['skills', 'Навыки'], ['path', 'Обучение'], ['faq', 'Вопросы'], ['contact', 'Связь']],
    name: ['Исмоилжон', 'Одилжонов'],
    roles: ['Full Stack разработчик', 'Frontend разработчик', 'React разработчик', 'Осваиваю Backend'],
    status: 'Открыт к проектам и практике',
    lead: 'Мне 16, я учусь в IT TAT и уже два года пишу код. Делаю сайты и веб-приложения: от вёрстки на HTML и CSS до React и серверной части.',
    cta1: 'Смотреть проекты', cta2: 'Написать мне',
    photoAlt: 'Исмоилжон Одилжонов за рабочим столом программиста',
    stats: [[2, 'года опыта'], [5, 'этапов обучения'], [6, 'проектов'], [10, 'технологий и инструментов']],
    aboutLabel: 'Обо мне', aboutTitle: 'Учусь делать продукты целиком',
    about: ['Я прошёл путь от HTML и CSS до JavaScript и React, а сейчас осваиваю Backend. Мне интересно видеть весь путь продукта: от кнопки на экране до данных на сервере.', 'Занимаюсь в центре IT TAT, много практикуюсь и выкладываю код на GitHub. Ищу проекты и команду, где можно расти и приносить пользу.'],
    aboutFacts: [['Возраст', '16 лет'], ['Опыт', '2 года'], ['Обучение', 'IT TAT'], ['Стек', 'HTML, CSS, JavaScript, React, Backend']],
    svcLabel: 'Услуги', svcTitle: 'Чем я могу помочь',
    svc: [
      { i: 'layout', t: 'Сайт', d: 'Визитка, лендинг или портфолио: адаптивные страницы, которые быстро открываются на телефоне и компьютере.' },
      { i: 'code', t: 'Веб-приложение', d: 'Интерактивные приложения на React: списки, фильтры, формы и работа с данными.' },
      { i: 'server', t: 'Backend и API', d: 'Простой сервер и REST API для хранения и передачи данных. Сейчас на стадии обучения.' },
      { i: 'zap', t: 'Доработка сайта', d: 'Обновление готовой страницы: порядок в дизайне, мобильная версия и скорость.' }
    ],
    workLabel: 'Проекты', workTitle: 'Что я уже сделал',
    searchPh: 'Поиск по проектам и технологиям', noRes: 'Ничего не найдено. Попробуйте другое слово или раздел.',
    filters: { all: 'Все', app: 'Приложения', site: 'Сайты', backend: 'Backend' },
    cnt: function (n) { return n + ' ' + pl(n, ['проект', 'проекта', 'проектов']); },
    kRole: 'Роль', kStack: 'Стек', kLearn: 'Чему научился', kYear: 'Год', learning: 'Учебный проект', code: 'Смотреть на GitHub',
    open: 'Открыть проект', close: 'Закрыть', prev: 'Предыдущий проект', next: 'Следующий проект',
    projects: {
      portfolio: { title: 'Моё портфолио', kind: 'Личный сайт', role: 'Дизайн и разработка', summary: 'Одностраничный сайт на React: проекты с фильтрами, тёмная и светлая тема, три языка и бриф для связи.', learn: 'Компоненты, состояние, адаптивная вёрстка.' },
      todo: { title: 'To-Do', kind: 'Список задач', role: 'Разработка', summary: 'Приложение для задач с фильтрами и сохранением данных в браузере.', learn: 'Хуки React и работа с localStorage.' },
      weather: { title: 'Погода', kind: 'Прогноз по городу', role: 'Разработка', summary: 'Поиск города и прогноз погоды, данные приходят из внешнего API.', learn: 'Запросы к API и обработка ответа на JavaScript.' },
      landing: { title: 'Лендинг', kind: 'Одностраничный сайт', role: 'Вёрстка', summary: 'Адаптивная страница с блоками услуг, отзывов и формой заявки.', learn: 'Flexbox, Grid и адаптивность.' },
      shop: { title: 'Магазин', kind: 'Интерфейс интернет-магазина', role: 'Разработка', summary: 'Каталог товаров, карточки и корзина на React.', learn: 'Работа с данными списков и компонентами.' },
      api: { title: 'REST API', kind: 'Серверная часть', role: 'Разработка', summary: 'Сервер с маршрутами для создания, чтения, изменения и удаления записей.', learn: 'Основы Backend и работа с данными.' }
    },
    skillsLabel: 'Навыки', skillsTitle: 'Чем я пользуюсь',
    skills: [
      { title: 'Frontend', items: [['HTML', 'Этап 1'], ['CSS', 'Этап 2'], ['JavaScript', 'Этап 3'], ['React', 'Этап 4']] },
      { title: 'Backend', items: [['Серверная часть', 'Этап 5'], ['API', 'Этап 5'], ['Базы данных', 'Этап 5']] },
      { title: 'Инструменты', items: [['Git', ''], ['GitHub', ''], ['VS Code', '']] }
    ],
    pathLabel: 'Обучение · IT TAT', pathTitle: 'Мой путь в программировании',
    path: [
      { yrs: 'Этап 1', title: 'HTML', org: 'IT TAT', text: 'Структура страниц, семантические теги, формы.' },
      { yrs: 'Этап 2', title: 'CSS', org: 'IT TAT', text: 'Вёрстка, Flexbox, Grid, адаптивность и анимации.' },
      { yrs: 'Этап 3', title: 'JavaScript', org: 'IT TAT', text: 'Основы языка, DOM, события, запросы к API.' },
      { yrs: 'Этап 4', title: 'React', org: 'IT TAT', text: 'Компоненты, состояние, хуки и сборка проекта.' },
      { yrs: 'Этап 5', title: 'Backend', org: 'IT TAT', text: 'Серверная часть, API и базы данных.' }
    ],
    faqLabel: 'Вопросы', faqTitle: 'Частые вопросы',
    faq: [
      ['С какими технологиями вы работаете?', 'Делаю веб-интерфейсы на HTML, CSS, JavaScript и React. Серверную часть (Backend) сейчас изучаю и практикую.'],
      ['Как начать работу?', 'Заполните короткий бриф в разделе «Связь» и отправьте его мне в Telegram. Я уточню задачу и предложу план.'],
      ['Сколько времени это займёт?', 'Срок зависит от объёма задачи. После брифа мы вместе договоримся о точной дате.'],
      ['Сайт будет работать на телефоне?', 'Да. Все страницы я делаю адаптивными: для телефона, планшета и компьютера.']
    ],
    contactLabel: 'Контакты', contactTitle: 'Расскажите о задаче',
    contactText: 'Заполните короткий бриф справа. Письмо соберётся само, останется скопировать его и отправить мне в Telegram или на почту.',
    briefName: 'Имя', briefEmail: 'Ваш email', briefType: 'Что нужно сделать', briefBudget: 'Бюджет', briefMsg: 'Расскажите о задаче',
    namePh: 'Как к вам обращаться', msgPh: 'Что за проект, для кого, к какому сроку',
    types: ['Сайт', 'Веб-приложение', 'Дизайн', 'Другое'],
    budgets: ['Пока не знаю', 'до $100', '$100–500', 'от $500'],
    previewLabel: 'Готовое письмо', copy: 'Скопировать письмо', mail: 'Открыть в почте', tg: 'Написать в Telegram',
    copied: 'Скопировано. Вставьте текст в Telegram или письмо.', copyFail: 'Не удалось скопировать автоматически. Текст выделен, нажмите Ctrl+C.',
    mailNote: 'Кнопка почты работает не везде. Адрес можно скопировать выше.', copyMail: 'Скопировать адрес',
    errEmail: 'Введите email в формате name@example.com', errMsg: 'Опишите задачу хотя бы в двух словах',
    brief: function (f) { return 'Здравствуйте, Исмоилжон!\nМеня зовут ' + (f.name || '…') + '.\n\nЗадача: ' + f.type + '.\nБюджет: ' + f.budget + '.\n\n' + (f.msg || '…') + '\n\nМой email для ответа: ' + (f.email || '…'); },
    subject: 'Новый проект',
    palPh: 'Введите команду или название раздела', palNone: 'Ничего не найдено', palOpen: 'Команды', palGo: 'Раздел', palAct: 'Действие', palLink: 'Ссылка',
    cmdTheme: 'Сменить тему', cmdCopyMail: 'Скопировать email', cmdTop: 'Наверх',
    foot: 'Сделано на React', top: 'Наверх', theme: 'Сменить тему', lang: 'Язык', skip: 'Перейти к содержимому',
    toastTheme: 'Тема изменена', toastMail: 'Email скопирован', cv: 'Скачать CV', toastCV: 'CV скачано', share: 'Поделиться', toastShare: 'Ссылка скопирована', sortLbl: 'Сортировка', sorts: ['Сначала новые', 'Сначала старые', 'По названию'], viewList: 'Список', viewGrid: 'Карточки', keysHint: 'T — тема · L — язык · / — поиск · Esc — закрыть'
  },
  en: {
    nav: [['about', 'About'], ['services', 'Services'], ['work', 'Work'], ['skills', 'Skills'], ['path', 'Learning'], ['faq', 'FAQ'], ['contact', 'Contact']],
    name: ['Ismoiljon', 'Odiljonov'],
    roles: ['Full Stack developer', 'Frontend developer', 'React developer', 'Learning Backend'],
    status: 'Open to projects and practice',
    lead: 'I am 16, I study at IT TAT and have been coding for two years. I build websites and web apps, from HTML and CSS markup to React and the server side.',
    cta1: 'See the work', cta2: 'Get in touch',
    photoAlt: 'Ismoiljon Odiljonov at a programmer desk',
    stats: [[2, 'years of experience'], [5, 'learning stages'], [6, 'projects'], [10, 'technologies and tools']],
    aboutLabel: 'About', aboutTitle: 'I am learning to build whole products',
    about: ['I went from HTML and CSS to JavaScript and React, and now I am learning Backend. I like to see the whole path of a product, from a button on the screen to data on the server.', 'I study at IT TAT, practise a lot and publish my code on GitHub. I am looking for projects and a team where I can grow and be useful.'],
    aboutFacts: [['Age', '16'], ['Experience', '2 years'], ['Studies', 'IT TAT'], ['Stack', 'HTML, CSS, JavaScript, React, Backend']],
    svcLabel: 'Services', svcTitle: 'How I can help',
    svc: [
      { i: 'layout', t: 'Website', d: 'A business card, landing page or portfolio: responsive pages that open fast on phones and computers.' },
      { i: 'code', t: 'Web app', d: 'Interactive React apps: lists, filters, forms and working with data.' },
      { i: 'server', t: 'Backend and API', d: 'A simple server and REST API to store and pass data. I am still learning this part.' },
      { i: 'zap', t: 'Site improvement', d: 'Refreshing an existing page: tidier design, a mobile version and speed.' }
    ],
    workLabel: 'Projects', workTitle: 'What I have built',
    searchPh: 'Search projects and technologies', noRes: 'Nothing found. Try another word or category.',
    filters: { all: 'All', app: 'Apps', site: 'Websites', backend: 'Backend' },
    cnt: function (n) { return n + (n === 1 ? ' project' : ' projects'); },
    kRole: 'Role', kStack: 'Stack', kLearn: 'What I learned', kYear: 'Year', learning: 'Learning project', code: 'See on GitHub',
    open: 'Open project', close: 'Close', prev: 'Previous project', next: 'Next project',
    projects: {
      portfolio: { title: 'My portfolio', kind: 'Personal website', role: 'Design and development', summary: 'A single-page React site with filterable projects, dark and light themes, three languages and a contact brief.', learn: 'Components, state, responsive layout.' },
      todo: { title: 'To-Do', kind: 'Task list', role: 'Development', summary: 'A task app with filters that saves data in the browser.', learn: 'React hooks and localStorage.' },
      weather: { title: 'Weather', kind: 'City forecast', role: 'Development', summary: 'Search for a city and see the forecast, with data from an external API.', learn: 'API requests and handling responses in JavaScript.' },
      landing: { title: 'Landing page', kind: 'Single-page site', role: 'Markup', summary: 'A responsive page with services, reviews and an enquiry form.', learn: 'Flexbox, Grid and responsive design.' },
      shop: { title: 'Shop', kind: 'Online store interface', role: 'Development', summary: 'Product catalog, cards and a cart built with React.', learn: 'Working with list data and components.' },
      api: { title: 'REST API', kind: 'Server side', role: 'Development', summary: 'A server with routes to create, read, update and delete records.', learn: 'Backend basics and working with data.' }
    },
    skillsLabel: 'Skills', skillsTitle: 'What I use',
    skills: [
      { title: 'Frontend', items: [['HTML', 'Stage 1'], ['CSS', 'Stage 2'], ['JavaScript', 'Stage 3'], ['React', 'Stage 4']] },
      { title: 'Backend', items: [['Server side', 'Stage 5'], ['API', 'Stage 5'], ['Databases', 'Stage 5']] },
      { title: 'Tools', items: [['Git', ''], ['GitHub', ''], ['VS Code', '']] }
    ],
    pathLabel: 'Learning · IT TAT', pathTitle: 'My path in programming',
    path: [
      { yrs: 'Stage 1', title: 'HTML', org: 'IT TAT', text: 'Page structure, semantic tags, forms.' },
      { yrs: 'Stage 2', title: 'CSS', org: 'IT TAT', text: 'Layout, Flexbox, Grid, responsive design and animation.' },
      { yrs: 'Stage 3', title: 'JavaScript', org: 'IT TAT', text: 'Language basics, the DOM, events, API requests.' },
      { yrs: 'Stage 4', title: 'React', org: 'IT TAT', text: 'Components, state, hooks and building a project.' },
      { yrs: 'Stage 5', title: 'Backend', org: 'IT TAT', text: 'The server side, APIs and databases.' }
    ],
    faqLabel: 'FAQ', faqTitle: 'Common questions',
    faq: [
      ['Which technologies do you work with?', 'I build web interfaces with HTML, CSS, JavaScript and React. I am currently studying and practising the server side (Backend).'],
      ['How do we start?', 'Fill in the short brief in the Contact section and send it to me on Telegram. I will clarify the task and suggest a plan.'],
      ['How long will it take?', 'The time depends on the size of the task. After the brief we will agree on an exact date together.'],
      ['Will the site work on a phone?', 'Yes. I make every page responsive for phones, tablets and computers.']
    ],
    contactLabel: 'Contact', contactTitle: 'Tell me about the task',
    contactText: 'Fill in the short brief on the right. The message writes itself. Copy it and send it to me on Telegram or by email.',
    briefName: 'Name', briefEmail: 'Your email', briefType: 'What you need', briefBudget: 'Budget', briefMsg: 'Tell me about the task',
    namePh: 'How should I address you', msgPh: 'What the project is, who it is for, the deadline',
    types: ['Website', 'Web app', 'Design', 'Other'],
    budgets: ['Not sure yet', 'under $100', '$100–500', 'over $500'],
    previewLabel: 'Your message', copy: 'Copy message', mail: 'Open in mail', tg: 'Write on Telegram',
    copied: 'Copied. Paste the text into Telegram or an email.', copyFail: 'Could not copy automatically. The text is selected, press Ctrl+C.',
    mailNote: 'The mail button does not work everywhere. You can copy the address above.', copyMail: 'Copy address',
    errEmail: 'Enter an email like name@example.com', errMsg: 'Describe the task in a few words',
    brief: function (f) { return 'Hello Ismoiljon!\nMy name is ' + (f.name || '…') + '.\n\nTask: ' + f.type + '.\nBudget: ' + f.budget + '.\n\n' + (f.msg || '…') + '\n\nReply to: ' + (f.email || '…'); },
    subject: 'New project',
    palPh: 'Type a command or a section name', palNone: 'Nothing found', palOpen: 'Commands', palGo: 'Section', palAct: 'Action', palLink: 'Link',
    cmdTheme: 'Switch theme', cmdCopyMail: 'Copy email address', cmdTop: 'Back to top',
    foot: 'Built with React', top: 'Back to top', theme: 'Switch theme', lang: 'Language', skip: 'Skip to content',
    toastTheme: 'Theme changed', toastMail: 'Email copied', cv: 'Download CV', toastCV: 'CV downloaded', share: 'Share', toastShare: 'Link copied', sortLbl: 'Sort', sorts: ['Newest first', 'Oldest first', 'By name'], viewList: 'List', viewGrid: 'Cards', keysHint: 'T — theme · L — language · / — search · Esc — close'
  }
};


/* ---------- helpers ---------- */
const PATHS = {
  arrow: 'M5 12h14M13 6l6 6-6 6', left: 'M19 12H5M11 6l-6 6 6 6', up: 'M12 19V5M6 11l6-6 6 6',
  close: 'M6 6l12 12M18 6L6 18', copy: 'M9 9h10v10H9zM5 15V5h10', check: 'M5 12.5l4.5 4.5L19 7.5',
  sun: 'M12 7a5 5 0 100 10 5 5 0 000-10zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z', mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3', ext: 'M7 17L17 7M9 7h8v8',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  github: 'M9 19c-4 1.5-4-2-6-2m12 4v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  insta: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM16 11.4a4 4 0 11-7.9 1.2 4 4 0 017.9-1.2zM17.5 6.5h.01',
  layout: 'M3 4h18v16H3zM3 9h18M9 9v11', code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  server: 'M4 5h16v5H4zM4 14h16v5H4zM8 7.5h.01M8 16.5h.01', zap: 'M13 2L4 14h7l-1 8 9-12h-7z',
  down: 'M12 3v12M6 11l6 6 6-6M4 21h16', share: 'M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
};

function Icon({ n, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[n]} />
    </svg>
  );
}

const GRID = ['c-a', 'c-i', 'c-i', 'c-i', 'c-s', 'c-a', 'c-a', 'c-i', 'c-i'];
const BARS = [36, 70, 50, 86];
const BAR_CLASS = ['c-i', 'c-a', 'c-i', 'c-s'];
const COVERS = [
  () => (
    <g>
      <circle className="c-a" cx="62" cy="62" r="38" />
      <rect className="c-i" x="92" y="30" width="38" height="60" rx="3" />
      <circle className="c-s" cx="112" cy="94" r="12" />
    </g>
  ),
  () => (
    <g>{BARS.map((h, i) => <rect key={i} className={BAR_CLASS[i]} x={24 + i * 30} y={104 - h} width="22" height={h} rx="2" />)}</g>
  ),
  () => (
    <g>{GRID.map((c, i) => <rect key={i} className={c} x={33 + (i % 3) * 34} y={13 + Math.floor(i / 3) * 34} width="26" height="26" rx="3" />)}</g>
  ),
  () => (
    <g>
      <path className="c-a" d="M20 100A40 40 0 0 1 100 100Z" />
      <path className="c-i" d="M60 100A40 40 0 0 1 140 100Z" opacity=".9" />
      <circle className="c-s" cx="112" cy="36" r="11" />
    </g>
  ),
  () => (
    <g>
      <rect className="c-i" x="24" y="22" width="112" height="10" rx="5" />
      <rect className="c-i" x="24" y="42" width="84" height="10" rx="5" />
      <rect className="c-i" x="24" y="62" width="100" height="10" rx="5" />
      <rect className="c-a" x="24" y="84" width="44" height="20" rx="4" />
      <circle className="c-s" cx="124" cy="94" r="9" />
    </g>
  ),
  () => (
    <g>
      <circle className="s-i" cx="80" cy="60" r="46" />
      <circle className="s-i" cx="80" cy="60" r="31" />
      <circle className="c-a" cx="80" cy="60" r="16" />
      <circle className="c-s" cx="122" cy="22" r="8" />
    </g>
  ),
];

function Cover({ v }) {
  return (
    <svg className="cover" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect className="c-b" width="160" height="120" />
      {COVERS[v % COVERS.length]()}
    </svg>
  );
}

function copyText(text, el) {
  const fallback = () => {
    try {
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    } catch (e) { /* ignore */ }
    return false;
  };
  if (!navigator.clipboard || !navigator.clipboard.writeText) return Promise.resolve(fallback());
  return navigator.clipboard.writeText(text).then(() => true, () => fallback());
}

function buildCV(t) {
  const L = [];
  L.push('# ' + t.name.join(' '), '', '**' + t.roles[0] + '** · IT TAT', '', t.lead, '');
  L.push('## ' + t.aboutLabel, '', ...t.about, '');
  L.push('## ' + t.skillsLabel, '');
  t.skills.forEach((g) => L.push('- **' + g.title + ':** ' + g.items.map((i) => i[0]).join(', ')));
  L.push('', '## ' + t.pathLabel, '');
  t.path.forEach((r) => L.push('- ' + r.yrs + ': ' + r.title + '. ' + r.text));
  L.push('', '## ' + t.workLabel, '');
  BASE.forEach((b) => {
    const x = t.projects[b.id];
    L.push('- **' + x.title + '** (' + b.year + ', ' + b.stack.join(', ') + '): ' + x.summary);
  });
  L.push('', '## ' + t.contactLabel, '', '- Email: ' + EMAIL);
  SOCIALS.forEach((s) => L.push('- ' + s.name + ': ' + s.url));
  return L.join('\n') + '\n';
}

function downloadFile(name, text) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function confetti() {
  if (REDUCED) return;
  const cs = getComputedStyle(document.documentElement);
  const colors = ['--accent', '--sig', '--ok', '--ink'].map((v) => cs.getPropertyValue(v).trim()).filter(Boolean);
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:90';
  const dpr = window.devicePixelRatio || 1;
  cv.width = window.innerWidth * dpr;
  cv.height = window.innerHeight * dpr;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  const ps = Array.from({ length: 120 }, () => ({
    x: window.innerWidth / 2, y: window.innerHeight * 0.7,
    vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 16 - 6,
    s: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    c: colors[Math.floor(Math.random() * colors.length)] || '#2236ff',
  }));
  const t0 = performance.now();
  const frame = (now) => {
    const k = (now - t0) / 1900;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ps.forEach((p) => {
      p.vy += 0.45; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, 1 - k);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    });
    if (k < 1) requestAnimationFrame(frame); else cv.remove();
  };
  requestAnimationFrame(frame);
}

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (REDUCED || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      const hot = e.target && e.target.closest && e.target.closest('a, button, summary, input, textarea, select, [role="button"]');
      if (ring.current) ring.current.classList.toggle('hot', !!hot);
    };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    loop();
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);
  return (
    <>
      <div className="cur-dot" ref={dot} aria-hidden="true"></div>
      <div className="cur-ring" ref={ring} aria-hidden="true"></div>
    </>
  );
}

function Split({ text }) {
  return text.split(' ').map((w, i) => (
    <span className="w" key={i}><span style={{ '--i': i }}>{w}</span>{' '}</span>
  ));
}

function useTyper(words) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (REDUCED) { setText(words[0]); return undefined; }
    let w = 0, c = 0, del = false, timer;
    function tick() {
      const word = words[w];
      if (!del) {
        c++;
        if (c >= word.length) { del = true; setText(word); timer = setTimeout(tick, 1800); return; }
      } else {
        c--;
        if (c <= 0) { del = false; w = (w + 1) % words.length; c = 0; }
      }
      setText(words[w].slice(0, c));
      timer = setTimeout(tick, del ? 35 : 70);
    }
    timer = setTimeout(tick, 1800);
    return () => clearTimeout(timer);
  }, [words]);
  return text;
}

function Count({ to }) {
  const [v, setV] = useState(to);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED || !('IntersectionObserver' in window)) return undefined;
    let raf = 0, done = false;
    const io = new IntersectionObserver((es) => {
      if (done || !es[0].isIntersecting) return;
      done = true;
      io.disconnect();
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 1100);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      step(t0);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{v}</span>;
}

/* ---------- sections ---------- */
function Header({ t, lang, setLang, dark, toggleTheme, active, openPalette, progRef }) {
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <a className="brand" href="#top" aria-label={t.name.join(' ')}>
          <span className="mark" aria-hidden="true">{t.name[0][0]}{t.name[1][0]}</span>
          <span className="brand-name">{t.name.join(' ')}</span>
        </a>
        <nav className="nav" aria-label="Sections">
          {t.nav.map((n) => (
            <a key={n[0]} href={'#' + n[0]} aria-current={active === n[0] ? 'true' : 'false'}>{n[1]}</a>
          ))}
        </nav>
        <div className="ctrls">
          <button type="button" className="kbtn" onClick={openPalette} aria-label={t.palOpen}>
            <Icon n="search" size={16} /><kbd>Ctrl K</kbd>
          </button>
          <div className="seg" role="group" aria-label={t.lang}>
            {['uz', 'ru', 'en'].map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button className="icon-btn" type="button" onClick={toggleTheme} aria-label={t.theme} title={t.theme}>
            <Icon n={dark ? 'sun' : 'moon'} />
          </button>
        </div>
      </div>
      <div className="prog" ref={progRef}></div>
    </header>
  );
}

function Hero({ t, onCV }) {
  const typed = useTyper(t.roles);
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
  };
  const tilt = (e) => {
    if (REDUCED || e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
    el.style.setProperty('--rx', ((0.5 - py) * 10).toFixed(2) + 'deg');
    el.style.setProperty('--gx', px * 100 + '%');
    el.style.setProperty('--gy', py * 100 + '%');
  };
  const untilt = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };
  return (
    <section className="hero wrap" id="top" ref={ref} onPointerMove={move}>
      <div className="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
      <div className="hero-cols">
        <div className="hero-text">
          <span className="status enter"><span className="dot"></span>{t.status}</span>
          <h1 className="name"><span>{t.name[0]}</span><span>{t.name[1]}</span></h1>
          <p className="role mono enter" style={{ '--d': '.3s' }} aria-label={t.roles[0]}>
            <span aria-hidden="true">{typed}<span className="caret"></span></span>
          </p>
          <p className="lead enter" style={{ '--d': '.4s' }}>{t.lead}</p>
          <div className="cta enter" style={{ '--d': '.5s' }}>
            <a className="btn primary" href="#work">{t.cta1}<Icon n="arrow" /></a>
            <a className="btn" href="#contact">{t.cta2}</a>
            <button type="button" className="btn" onClick={onCV}><Icon n="down" />{t.cv}</button>
          </div>
        </div>
        <figure className="portrait enter" style={{ '--d': '.2s' }} onPointerMove={tilt} onPointerLeave={untilt}>
          <img src={photo} alt={t.photoAlt} width="937" height="1000" />
          <pre className="codecard" aria-hidden="true">
            <span className="k">const</span>{' dev = {\n  name: '}<span className="s">{"'Ismoiljon'"}</span>{',\n  stack: ['}<span className="s">{"'React'"}</span>{', '}<span className="s">{"'JS'"}</span>{'],\n  learning: '}<span className="s">{"'Backend'"}</span>{',\n  open: '}<span className="k">true</span>{'\n};'}
          </pre>
        </figure>
      </div>
      <ul className="stats">
        {t.stats.map((s) => (
          <li key={s[1]}><b><Count to={s[0]} />{s[0] >= 10 ? '+' : ''}</b><span>{s[1]}</span></li>
        ))}
      </ul>
    </section>
  );
}

function Marquee() {
  const row = (list, hide, extra) => (
    <div className={'marq' + (extra ? ' ' + extra : '')} aria-hidden={hide ? 'true' : undefined}>
      <div className="marq-track">
        <div className="marq-set">{list.map((s) => <span className="mono" key={s}>{s}</span>)}</div>
        <div className="marq-set" aria-hidden="true">{list.map((s) => <span className="mono" key={s}>{s}</span>)}</div>
      </div>
    </div>
  );
  return <>{row(STACK, false, '')}{row(STACK.slice().reverse(), true, 'rev')}</>;
}

function SecHead({ label, title }) {
  return (
    <div className="sec-head rv">
      <span className="label mono">{label}</span>
      <h2 aria-label={title}><span aria-hidden="true"><Split text={title} /></span></h2>
    </div>
  );
}

function About({ t }) {
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <SecHead label={t.aboutLabel} title={t.aboutTitle} />
        <div className="about rv">
          <div>{t.about.map((s, i) => <p key={i}>{s}</p>)}</div>
          <dl className="facts">
            {t.aboutFacts.map((f) => <div key={f[0]}><dt>{f[0]}</dt><dd>{f[1]}</dd></div>)}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Services({ t }) {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <SecHead label={t.svcLabel} title={t.svcTitle} />
        <div className="cards rv">
          {t.svc.map((c) => (
            <article className="card" key={c.t}>
              <span className="ic"><Icon n={c.i} size={22} /></span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work({ t, filter, setFilter, query, setQuery, items, onOpen, sort, setSort, view, setView }) {
  const cats = ['all', 'app', 'site', 'backend'];
  const count = (c) => (c === 'all' ? BASE.length : BASE.filter((b) => b.cat === c).length);
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <SecHead label={t.workLabel + ' · ' + t.cnt(items.length)} title={t.workTitle} />
        <div className="tools">
          <div className="filters" role="group" aria-label={t.workLabel}>
            {cats.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {t.filters[c]}<small>{count(c)}</small>
              </button>
            ))}
          </div>
          <div className="tool-ctrls">
            <label className="sr" htmlFor="f-sort">{t.sortLbl}</label>
            <select id="f-sort" className="in" value={sort} onChange={(e) => setSort(e.target.value)}>
              {['new', 'old', 'az'].map((v, i) => <option key={v} value={v}>{t.sorts[i]}</option>)}
            </select>
            <div className="seg" role="group" aria-label="View">
              <button type="button" aria-pressed={view === 'list'} aria-label={t.viewList} title={t.viewList} onClick={() => setView('list')}><Icon n="list" size={16} /></button>
              <button type="button" aria-pressed={view === 'grid'} aria-label={t.viewGrid} title={t.viewGrid} onClick={() => setView('grid')}><Icon n="grid" size={16} /></button>
            </div>
          </div>
          <div className="search">
            <Icon n="search" size={16} />
            <input id="f-search" className="in" type="search" placeholder={t.searchPh} aria-label={t.searchPh} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        {items.length === 0 ? (
          <p className="empty" role="status">{t.noRes}</p>
        ) : (
          <ul className={'rows' + (view === 'grid' ? ' as-grid' : '')}>
            {items.map((b, i) => {
              const x = t.projects[b.id];
              return (
                <li key={b.id}>
                  <button type="button" className="row" onClick={() => onOpen(i)} aria-label={t.open + ': ' + x.title}>
                    <span className="row-year mono">{b.year}</span>
                    <Cover v={b.v} />
                    <span className="row-main"><span className="row-title">{x.title}</span><span className="row-kind">{x.kind}</span></span>
                    <span className="row-tags">{b.stack.slice(0, 3).map((s) => <span className="tag" key={s}>{s}</span>)}</span>
                    <span className="row-go" aria-hidden="true"><Icon n="arrow" /></span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function useTrap(ref, onClose, extra) {
  useEffect(() => {
    const prev = document.activeElement;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      if (prev && prev.focus) prev.focus();
    };
  }, []);
  useEffect(() => {
    function key(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (extra && extra(e)) return;
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll('button:not([disabled]), a[href], input');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  });
}

function Modal({ t, items, index, onClose, onNav }) {
  const b = items[index];
  const x = t.projects[b.id];
  const panel = useRef(null);
  const closeBtn = useRef(null);
  useEffect(() => { if (closeBtn.current) closeBtn.current.focus(); }, []);
  useTrap(panel, onClose, (e) => {
    if (e.key === 'ArrowRight') { onNav(1); return true; }
    if (e.key === 'ArrowLeft') { onNav(-1); return true; }
    return false;
  });
  return (
    <div className="ovl" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="panel" role="dialog" aria-modal="true" aria-labelledby="pm-title" ref={panel}>
        <div className="panel-cover"><Cover v={b.v} /></div>
        <div className="panel-body">
          <div className="panel-top">
            <span className="mono label">{x.kind}</span>
            <button type="button" className="icon-btn" ref={closeBtn} onClick={onClose} aria-label={t.close}><Icon n="close" /></button>
          </div>
          <h3 id="pm-title">{x.title}</h3>
          <div><span className="badge">{t.learning}</span></div>
          <p>{x.summary}</p>
          <dl className="meta">
            <div><dt className="mono">{t.kYear}</dt><dd>{b.year}</dd></div>
            <div><dt className="mono">{t.kRole}</dt><dd>{x.role}</dd></div>
            <div><dt className="mono">{t.kLearn}</dt><dd>{x.learn}</dd></div>
            <div><dt className="mono">{t.kStack}</dt><dd><span className="tags">{b.stack.map((s) => <span className="tag" key={s}>{s}</span>)}</span></dd></div>
          </dl>
          <div className="pager">
            <button type="button" className="icon-btn" onClick={() => onNav(-1)} aria-label={t.prev}><Icon n="left" /></button>
            <button type="button" className="icon-btn" onClick={() => onNav(1)} aria-label={t.next}><Icon n="arrow" /></button>
            <span className="spacer"></span>
            <a className="btn sm" href={SOCIALS[1].url} target="_blank" rel="noopener noreferrer"><Icon n="github" size={16} />{t.code}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Palette({ t, cmds, onClose }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const box = useRef(null);
  const inp = useRef(null);
  useEffect(() => { if (inp.current) inp.current.focus(); }, []);
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return cmds.filter((c) => !n || (c.label + ' ' + c.kind).toLowerCase().indexOf(n) !== -1);
  }, [q, cmds]);
  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => {
    const el = box.current && box.current.querySelector('[aria-selected="true"]');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [sel]);
  const run = (c) => { onClose(); setTimeout(() => c.run(), 30); };
  useTrap(box, onClose, (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((i) => (list.length ? (i + 1) % list.length : 0)); return true; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((i) => (list.length ? (i - 1 + list.length) % list.length : 0)); return true; }
    if (e.key === 'Enter' && list[sel]) { e.preventDefault(); run(list[sel]); return true; }
    return false;
  });
  return (
    <div className="ovl top" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pal" role="dialog" aria-modal="true" aria-label={t.palOpen} ref={box}>
        <input ref={inp} className="pal-in" type="text" placeholder={t.palPh} aria-label={t.palPh} value={q} onChange={(e) => setQ(e.target.value)} />
        {list.length === 0 ? (
          <p className="pal-empty" role="status">{t.palNone}</p>
        ) : (
          <ul className="pal-list" role="listbox">
            {list.map((c, i) => (
              <li key={c.id} role="presentation">
                <button type="button" role="option" className="pal-item" aria-selected={i === sel} onMouseMove={() => setSel(i)} onClick={() => run(c)}>
                  <span>{c.label}</span><small>{c.kind}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="pal-foot mono">{t.keysHint}</div>
      </div>
    </div>
  );
}

function Skills({ t }) {
  return (
    <section className="sec" id="skills">
      <div className="wrap">
        <SecHead label={t.skillsLabel} title={t.skillsTitle} />
        <div className="skills rv">
          {t.skills.map((g) => (
            <div key={g.title}>
              <h3 className="mono">{g.title}</h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it[0]}><span>{it[0]}</span>{it[1] ? <span className="mono tagm">{it[1]}</span> : null}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Path({ t }) {
  return (
    <section className="sec" id="path">
      <div className="wrap">
        <SecHead label={t.pathLabel} title={t.pathTitle} />
        <ol className="path rv">
          {t.path.map((r) => (
            <li key={r.yrs}>
              <span className="yrs mono">{r.yrs}</span>
              <div><h3>{r.title}</h3><div className="org">{r.org}</div><p>{r.text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq({ t }) {
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <SecHead label={t.faqLabel} title={t.faqTitle} />
        <div className="faq rv">
          {t.faq.map((f) => (
            <details key={f[0]}><summary>{f[0]}</summary><p>{f[1]}</p></details>
          ))}
        </div>
      </div>
    </section>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = 600;

function Contact({ t, lang, toast }) {
  const [f, setF] = useState(() => {
    try {
      const d = JSON.parse(store.get('pf-draft') || 'null');
      if (d && typeof d === 'object') {
        return { name: String(d.name || ''), email: String(d.email || ''), type: Number(d.type) || 0, budget: Number(d.budget) || 0, msg: String(d.msg || '').slice(0, MAX) };
      }
    } catch (e) { /* ignore */ }
    return { name: '', email: '', type: 0, budget: 0, msg: '' };
  });
  useEffect(() => { store.set('pf-draft', JSON.stringify(f)); }, [f]);
  const [showErr, setShowErr] = useState(false);
  const [status, setStatus] = useState('');
  const previewRef = useRef(null);
  const mailRef = useRef(null);
  useEffect(() => { setStatus(''); }, [lang]);
  const up = (k, v) => { setF((o) => ({ ...o, [k]: v })); setStatus(''); };
  const okEmail = EMAIL_RE.test(f.email.trim());
  const okMsg = f.msg.trim().length >= 8;
  const text = t.brief({ name: f.name.trim(), email: f.email.trim(), type: t.types[f.type], budget: t.budgets[f.budget], msg: f.msg.trim() });
  const doCopy = () => {
    if (!okEmail || !okMsg) {
      setShowErr(true);
      const el = document.getElementById(!okEmail ? 'f-email' : 'f-msg');
      if (el) el.focus();
      return;
    }
    copyText(text, previewRef.current).then((ok) => { setStatus(ok ? 'ok' : 'fail'); if (ok) { toast(t.copied); confetti(); } });
  };
  const href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(t.subject) + '&body=' + encodeURIComponent(text);
  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <SecHead label={t.contactLabel} title={t.contactTitle} />
        <div className="contact rv">
          <div className="contact-side">
            <p>{t.contactText}</p>
            <button type="button" className="mail" ref={mailRef} title={t.copyMail} onClick={() => copyText(EMAIL, mailRef.current).then((ok) => { if (ok) toast(t.toastMail); })}>
              <Icon n="copy" /><span>{EMAIL}</span>
            </button>
            <div className="socials">
              {SOCIALS.map((x) => (
                <a key={x.id} className="soc" href={x.url} target="_blank" rel="noopener noreferrer">
                  <Icon n={x.icon} size={20} />
                  <span><b>{x.name}</b><small>{x.handle}</small></span>
                  <Icon n="ext" size={16} />
                </a>
              ))}
            </div>
          </div>
          <form className="form" onSubmit={(e) => { e.preventDefault(); doCopy(); }} noValidate>
            <div className="fields">
              <div className="field">
                <label htmlFor="f-name">{t.briefName}</label>
                <input id="f-name" className="in" type="text" autoComplete="name" placeholder={t.namePh} value={f.name} onChange={(e) => up('name', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="f-email">{t.briefEmail}</label>
                <input id="f-email" className="in" type="email" autoComplete="email" placeholder="name@example.com" value={f.email} aria-invalid={showErr && !okEmail} onChange={(e) => up('email', e.target.value)} />
                {showErr && !okEmail ? <span className="err">{t.errEmail}</span> : null}
              </div>
            </div>
            <div className="field">
              <span className="lbl" id="l-type">{t.briefType}</span>
              <div className="types" role="radiogroup" aria-labelledby="l-type">
                {t.types.map((x, i) => (
                  <button key={i} type="button" role="radio" aria-checked={f.type === i} className="chip" onClick={() => up('type', i)}>{x}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-budget">{t.briefBudget}</label>
              <select id="f-budget" className="in" value={f.budget} onChange={(e) => up('budget', Number(e.target.value))}>
                {t.budgets.map((x, i) => <option key={i} value={i}>{x}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-msg"><span>{t.briefMsg}</span><span>{f.msg.length}/{MAX}</span></label>
              <textarea id="f-msg" className="in" maxLength={MAX} placeholder={t.msgPh} value={f.msg} aria-invalid={showErr && !okMsg} onChange={(e) => up('msg', e.target.value)}></textarea>
              {showErr && !okMsg ? <span className="err">{t.errMsg}</span> : null}
            </div>
            <div className="preview-box">
              <span className="lbl mono">{t.previewLabel}</span>
              <pre className="preview" ref={previewRef}>{text}</pre>
            </div>
            <div className="actions">
              <button type="submit" className="btn primary"><Icon n={status === 'ok' ? 'check' : 'copy'} />{t.copy}</button>
              <a className="btn" href={SOCIALS[0].url} target="_blank" rel="noopener noreferrer"><Icon n="send" />{t.tg}</a>
              <a className="btn" href={href}><Icon n="mail" />{t.mail}</a>
            </div>
            <p className="note" aria-live="polite">{status === 'fail' ? t.copyFail : status === 'ok' ? t.copied : t.mailNote}</p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- app ---------- */
function initialLang() {
  const v = store.get('pf-lang');
  if (v === 'uz' || v === 'ru' || v === 'en') return v;
  const n = (navigator.language || '').toLowerCase();
  return n.indexOf('ru') === 0 ? 'ru' : n.indexOf('en') === 0 ? 'en' : 'uz';
}

export default function App() {
  const [lang, setLangRaw] = useState(initialLang);
  const [dark, setDark] = useState(() => {
    const a = document.documentElement.getAttribute('data-theme');
    return a ? a === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [active, setActive] = useState('about');
  const [filter, setFilterRaw] = useState(() => {
    const v = store.get('pf-filter');
    return ['all', 'app', 'site', 'backend'].indexOf(v) >= 0 ? v : 'all';
  });
  const [query, setQuery] = useState('');
  const [sort, setSortRaw] = useState(() => { const v = store.get('pf-sort'); return ['new', 'old', 'az'].indexOf(v) >= 0 ? v : 'new'; });
  const [view, setViewRaw] = useState(() => (store.get('pf-view') === 'grid' ? 'grid' : 'list'));
  const actions = useRef({});
  const [openIdx, setOpen] = useState(-1);
  const [pal, setPal] = useState(false);
  const [toast, setToast] = useState('');
  const [showTop, setShowTop] = useState(false);
  const progRef = useRef(null);
  const toastTimer = useRef(0);
  const t = I[lang];

  useEffect(() => {
    const saved = store.get('pf-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
      setDark(saved === 'dark');
    }
  }, []);
  useEffect(() => { document.documentElement.lang = lang; document.title = t.name.join(' '); }, [lang, t]);

  useEffect(() => {
    const ids = ['about', 'services', 'work', 'skills', 'path', 'faq', 'contact'];
    const rv = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) { rv.forEach((el) => el.classList.add('in')); return undefined; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach((el) => io.observe(el));
    const io2 = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io2.observe(el); });
    return () => { io.disconnect(); io2.disconnect(); };
  }, []);

  useEffect(() => {
    let ticking = false;
    const upd = () => {
      ticking = false;
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      if (progRef.current) progRef.current.style.setProperty('--p', pct + '%');
      d.style.setProperty('--pd', pct + '%');
      d.style.setProperty('--sy', String(Math.round(window.scrollY)));
      const pathEl = document.querySelector('.path');
      if (pathEl) {
        const r = pathEl.getBoundingClientRect();
        const vh = window.innerHeight;
        const k = Math.max(0, Math.min(1, (vh * 0.6 - r.top) / r.height));
        pathEl.style.setProperty('--pp', k * 100 + '%');
        pathEl.querySelectorAll('li').forEach((li) => li.classList.toggle('on', li.getBoundingClientRect().top < vh * 0.6));
      }
      setShowTop(window.scrollY > 900);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    upd();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const key = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setPal((v) => !v); return; }
      const typing = /INPUT|TEXTAREA|SELECT/.test(tag);
      if (e.key === '/' && !typing) { e.preventDefault(); setPal(true); return; }
      if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 't' || e.key === 'T') actions.current.theme();
        if (e.key === 'l' || e.key === 'L') actions.current.lang();
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);

  useEffect(() => {
    if (REDUCED || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let cur = null;
    const reset = () => { if (cur) { cur.style.transform = ''; cur = null; } };
    const mv = (e) => {
      const target = e.target && e.target.closest ? e.target : null;
      if (!target) return;
      const card = target.closest('.card');
      if (card) {
        const cr = card.getBoundingClientRect();
        card.style.setProperty('--cx', e.clientX - cr.left + 'px');
        card.style.setProperty('--cy', e.clientY - cr.top + 'px');
      }
      const el = target.closest('.btn, .icon-btn:not(.totop), .kbtn');
      if (el !== cur) { reset(); cur = el; }
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.2 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.28 + 'px)';
    };
    document.addEventListener('pointermove', mv, { passive: true });
    document.documentElement.addEventListener('mouseleave', reset);
    return () => {
      document.removeEventListener('pointermove', mv);
      document.documentElement.removeEventListener('mouseleave', reset);
      reset();
    };
  }, []);

  const showToast = useCallback((m) => {
    setToast(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }, []);
  const setLang = (l) => { setLangRaw(l); store.set('pf-lang', l); };
  const setFilter = (c) => { setFilterRaw(c); store.set('pf-filter', c); };
  const setSort = (v) => { setSortRaw(v); store.set('pf-sort', v); };
  const setView = (v) => { setViewRaw(v); store.set('pf-view', v); };
  const onCV = () => { downloadFile('Ismoiljon-Odiljonov-CV.md', buildCV(t)); showToast(t.toastCV); };
  const share = () => {
    const data = { title: t.name.join(' '), url: window.location.href };
    if (navigator.share) navigator.share(data).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(() => showToast(t.toastShare), () => {});
  };
  const toggleTheme = (e) => {
    const next = dark ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.setAttribute('data-theme', next);
      store.set('pf-theme', next);
      setDark(next === 'dark');
    };
    if (REDUCED || !document.startViewTransition) { apply(); return; }
    const hasPoint = e && typeof e.clientX === 'number' && !(e.clientX === 0 && e.clientY === 0);
    document.documentElement.style.setProperty('--tx', (hasPoint ? e.clientX : window.innerWidth / 2) + 'px');
    document.documentElement.style.setProperty('--ty', (hasPoint ? e.clientY : window.innerHeight / 2) + 'px');
    document.startViewTransition(() => { flushSync(apply); });
  };
  const cycleLang = () => { const o = ['uz', 'ru', 'en']; setLang(o[(o.indexOf(lang) + 1) % o.length]); };
  actions.current = { theme: () => toggleTheme(), lang: cycleLang };

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = BASE.filter((b) => {
      if (filter !== 'all' && b.cat !== filter) return false;
      if (!q) return true;
      const x = t.projects[b.id];
      return (x.title + ' ' + x.kind + ' ' + x.summary + ' ' + b.stack.join(' ')).toLowerCase().indexOf(q) !== -1;
    });
    const cmp = {
      new: (a, b) => b.year - a.year,
      old: (a, b) => a.year - b.year,
      az: (a, b) => t.projects[a.id].title.localeCompare(t.projects[b.id].title),
    }[sort];
    return out.slice().sort(cmp);
  }, [filter, query, sort, t]);
  const nav = (d) => setOpen((i) => (i + d + items.length) % items.length);

  const cmds = useMemo(() => {
    const list = [];
    t.nav.forEach((n) => list.push({
      id: 's-' + n[0], label: n[1], kind: t.palGo,
      run: () => { const el = document.getElementById(n[0]); if (el) el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); },
    }));
    list.push({ id: 'theme', label: t.cmdTheme, kind: t.palAct, run: toggleTheme });
    ['uz', 'ru', 'en'].forEach((l) => {
      if (l !== lang) list.push({ id: 'l-' + l, label: { uz: 'O‘zbekcha', ru: 'Русский', en: 'English' }[l], kind: t.lang, run: () => setLang(l) });
    });
    list.push({
      id: 'mail', label: t.cmdCopyMail, kind: t.palAct,
      run: () => { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(() => showToast(t.toastMail), () => {}); },
    });
    SOCIALS.forEach((x) => list.push({
      id: 'o-' + x.id, label: x.name + ' ' + x.handle, kind: t.palLink,
      run: () => window.open(x.url, '_blank', 'noopener,noreferrer'),
    }));
    list.push({ id: 'top', label: t.cmdTop, kind: t.palAct, run: () => window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }) });
    return list;
  }, [lang, dark]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Cursor />
      <a className="skip" href="#about">{t.skip}</a>
      <Header t={t} lang={lang} setLang={setLang} dark={dark} toggleTheme={toggleTheme} active={active} openPalette={() => setPal(true)} progRef={progRef} />
      <main>
        <Hero t={t} onCV={onCV} />
        <Marquee />
        <About t={t} />
        <Services t={t} />
        <Work t={t} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} items={items} onOpen={setOpen} sort={sort} setSort={setSort} view={view} setView={setView} />
        <Skills t={t} />
        <Path t={t} />
        <Faq t={t} />
        <Contact t={t} lang={lang} toast={showToast} />
      </main>
      <footer>
        <div className="wrap"><div className="mega" aria-hidden="true">{t.name[1]}</div></div>
        <div className="wrap foot">
          <span>© {new Date().getFullYear()} {t.name.join(' ')} · {t.foot}</span>
          <div className="foot-links">
            {SOCIALS.map((x) => <a key={x.id} href={x.url} target="_blank" rel="noopener noreferrer">{x.name}</a>)}
            <button type="button" className="btn sm" onClick={share}><Icon n="share" size={16} />{t.share}</button>
          </div>
        </div>
      </footer>
      {showTop ? <a className="icon-btn totop" href="#top" aria-label={t.top} title={t.top}><Icon n="up" /></a> : null}
      {openIdx >= 0 && items[openIdx] ? <Modal t={t} items={items} index={openIdx} onClose={() => setOpen(-1)} onNav={nav} /> : null}
      {pal ? <Palette t={t} cmds={cmds} onClose={() => setPal(false)} /> : null}
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}