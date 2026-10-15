const fs = require('fs');
const path = require('path');

const routes = [
    'groups/page.tsx',
    'wallet/page.tsx',
    'wallet/saldo-pending/page.tsx',
    'wallet/saldo-tersedia/page.tsx',
    'teachers/page.tsx',
    'teachers/[id]/page.tsx',
    'recitation/page.tsx',
    'dashboard/page.tsx',
    'friend/page.tsx',
    'friends/page.tsx'
];

routes.forEach(r => {
    const target = path.join('src', 'app', 'id', r);
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const importTarget = '@/app/en/' + r.replace(/\.tsx$/, '');
    fs.writeFileSync(target, `export { default, metadata } from "${importTarget}";\n`);
    console.log('Created:', target);
});
