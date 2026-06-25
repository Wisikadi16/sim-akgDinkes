const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard/Laporan.jsx', 'utf8');

// Replace STATUS DOA column check
content = content.replace(/row\.kasus === 'DOA' \|\| row\.kategori_kasus === 'DOA'/g, "(row.kasus?.toLowerCase().includes('doa') || row.kategori_kasus?.toLowerCase().includes('doa'))");

// Replace all stat cards
const categories = [
    { label: 'Gawat Darurat', val: 'gawat darurat' },
    { label: 'Transport', val: 'transport' },
    { label: 'KLL', val: 'kll' },
    { label: 'Homecare', val: 'homecare' },
    { label: 'Maternal Neonatal', val: 'maternal neonatal' },
    { label: 'Cancel', val: 'cancel' },
    { label: 'DOA', val: 'doa' }
];

categories.forEach(cat => {
    const search = `i.kasus === '${cat.label}' || i.kategori_kasus === '${cat.label}'`;
    const replace = `(i.kasus?.toLowerCase().includes('${cat.val}') || i.kategori_kasus?.toLowerCase().includes('${cat.val}'))`;
    content = content.replace(search, replace);
});

fs.writeFileSync('resources/js/Pages/Dashboard/Laporan.jsx', content);
console.log('Fixed Laporan.jsx');
