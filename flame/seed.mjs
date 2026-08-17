import { access, writeFile } from 'node:fs/promises';

const baseUrl = process.env.FLAME_URL ?? 'http://flame:5005';
const password = process.env.FLAME_PASSWORD ?? 'change-me';
const markerPath = '/app/data/.sample-content-v1';

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(
      `${options.method ?? 'GET'} ${path} failed: ${response.status} ${JSON.stringify(payload)}`
    );
  }

  return payload.data;
}

async function waitForFlame() {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    try {
      await request('/api/apps');
      return;
    } catch {
      if (attempt === 60) {
        throw new Error('Flame did not become ready within 60 seconds.');
      }

      await sleep(1000);
    }
  }
}

async function post(path, body, token) {
  return request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization-Flame': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

async function markSeeded(message) {
  await writeFile(markerPath, `${new Date().toISOString()} ${message}\n`);
}

try {
  await access(markerPath);
  console.log('Flame sample content is already initialized.');
  process.exit(0);
} catch {
  // Continue with first-run initialization.
}

await waitForFlame();

const [existingApps, existingCategories] = await Promise.all([
  request('/api/apps'),
  request('/api/categories'),
]);

if (existingApps.length > 0 || existingCategories.length > 0) {
  await markSeeded('Skipped because existing user content was found.');
  console.log('Existing Flame content found; sample content was not added.');
  process.exit(0);
}

const login = await request('/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password, duration: '5m' }),
});
const token = login.token;

const applications = [
  {
    name: process.env.SAMPLE_INDEX_NAME ?? 'Flame Project',
    url:
      process.env.SAMPLE_INDEX_URL ??
      'https://github.com/pawelmalak/flame',
    icon: 'view-dashboard',
    description: 'ダッシュボード比較ページ',
    isPublic: 1,
  },
  {
    name: 'Homepage',
    url:
      process.env.SAMPLE_HOMEPAGE_URL ??
      'https://github.com/gethomepage/homepage',
    icon: 'home-automation',
    description: 'Homelabサービス一覧',
    isPublic: 1,
  },
  {
    name: 'Dashy',
    url:
      process.env.SAMPLE_DASHY_URL ??
      'https://github.com/lissy93/dashy',
    icon: 'view-dashboard-variant',
    description: '多機能スタートページ',
    isPublic: 1,
  },
  {
    name: 'Glance',
    url:
      process.env.SAMPLE_GLANCE_URL ??
      'https://github.com/glanceapp/glance',
    icon: 'rss',
    description: 'フィード型ダッシュボード',
    isPublic: 1,
  },
  {
    name: 'Jump',
    url:
      process.env.SAMPLE_JUMP_URL ??
      'https://github.com/daledavies/jump',
    icon: 'monitor-dashboard',
    description: 'リンク集と死活監視',
    isPublic: 1,
  },
  {
    name: 'linkding',
    url:
      process.env.SAMPLE_LINKDING_URL ??
      'https://github.com/sissbruecker/linkding',
    icon: 'bookmark-multiple',
    description: 'ブックマーク管理',
    isPublic: 1,
  },
  {
    name: 'Homarr',
    url:
      process.env.SAMPLE_HOMARR_URL ??
      'https://github.com/homarr-labs/homarr',
    icon: 'view-dashboard-edit',
    description: 'GUI編集型ダッシュボード',
    isPublic: 1,
  },
  {
    name: 'Homer',
    url:
      process.env.SAMPLE_HOMER_URL ??
      'https://github.com/bastienwirtz/homer',
    icon: 'feather',
    description: '静的YAMLランチャー',
    isPublic: 1,
  },
];

for (const application of applications) {
  await post('/api/apps', application, token);
}

const categories = [
  {
    name: 'Dashboard projects',
    bookmarks: [
      ['Homepage', 'https://github.com/gethomepage/homepage', 'github'],
      ['Dashy', 'https://github.com/lissy93/dashy', 'github'],
      ['Flame', 'https://github.com/pawelmalak/flame', 'github'],
      ['Glance', 'https://github.com/glanceapp/glance', 'github'],
      ['Jump', 'https://github.com/daledavies/jump', 'github'],
      ['linkding', 'https://github.com/sissbruecker/linkding', 'github'],
      ['Homarr', 'https://github.com/homarr-labs/homarr', 'github'],
      ['Homer', 'https://github.com/bastienwirtz/homer', 'github'],
    ],
  },
  {
    name: 'Resources',
    bookmarks: [
      ['Docker Documentation', 'https://docs.docker.com/', 'docker'],
      ['Docker Hub', 'https://hub.docker.com/', 'docker'],
      [
        'Awesome Selfhosted',
        'https://github.com/awesome-selfhosted/awesome-selfhosted',
        'server',
      ],
      ['selfh.st', 'https://selfh.st/', 'rss'],
    ],
  },
];

for (const categoryDefinition of categories) {
  const category = await post(
    '/api/categories',
    { name: categoryDefinition.name, isPublic: 1 },
    token
  );

  for (const [name, url, icon] of categoryDefinition.bookmarks) {
    await post(
      '/api/bookmarks',
      {
        name,
        url,
        icon,
        categoryId: category.id,
        isPublic: 1,
      },
      token
    );
  }
}

await markSeeded('Added dashboard sample applications and bookmarks.');
console.log(
  `Added ${applications.length} applications, ${categories.length} categories, and ${categories.flatMap((category) => category.bookmarks).length} bookmarks.`
);
