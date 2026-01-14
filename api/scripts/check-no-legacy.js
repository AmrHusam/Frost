const fs = require('fs');
const path = require('path');

const BANNED_IMPORTS = [
    'from "./services/socketService"',
    'from \'./services/socketService\'',
    'from "../services/socketService"',
    'from \'../services/socketService\'',
    'SocketService.getInstance'
];

let violationsFound = false;

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);

    for (const banned of BANNED_IMPORTS) {
        if (content.includes(banned)) {
            console.error(`\n❌ LEGACY CODE DETECTED`);
            console.error(`   File: ${relativePath}`);
            console.error(`   Found: ${banned}`);
            console.error(`   Action: Remove all references to old SocketService singleton\n`);
            violationsFound = true;
        }
    }
}

function walkDir(dir) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // Skip node_modules and other non-source directories
                if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
                    walkDir(filePath);
                }
            } else if (file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.endsWith('.deprecated.ts')) {
                // Skip deprecated files - they're intentionally old
                checkFile(filePath);
            }
        });
    } catch (err) {
        // Silently skip directories that can't be read
    }
}

console.log('🔍 Checking for legacy SocketService imports...\n');
walkDir('./src');

if (violationsFound) {
    console.error('❌ BUILD FAILED: Legacy code detected. Phase 1 incomplete.\n');
    process.exit(1);
} else {
    console.log('✅ No legacy imports found. Build can proceed.\n');
    process.exit(0);
}
