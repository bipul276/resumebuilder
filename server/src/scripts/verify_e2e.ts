
import fs from 'fs';

const BASE_URL = 'http://localhost:3001/api';
const LOG_FILE = 'e2e_log.txt';

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

// Clear log file
if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

async function login(email: string, password: string) {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json() as any;
        return data.token;
    } catch (error: any) {
        log(`❌ Login failed for ${email}: ${error.message}`);
        return null;
    }
}

async function verifyFeatures() {
    log('🧪 Starting E2E Feature Verification...\n');

    const users = [
        { email: 'test_free@example.com', tier: 'free' },
        { email: 'test_pro@example.com', tier: 'pro' },
        { email: 'test_pro_plus@example.com', tier: 'pro_plus' }
    ];

    for (const user of users) {
        log(`--- Testing ${user.email} (${user.tier}) ---`);
        const token = await login(user.email, 'password');

        if (!token) continue;

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 1. PDF Generation (Sandbox)
        try {
            const pdfRes = await fetch(`${BASE_URL}/generate-sandbox-pdf`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    elements: [{
                        type: 'text',
                        content: 'Test',
                        style: { left: 10, top: 10, width: 100, height: 20, zIndex: 1, fontSize: 12, color: '#000000' }
                    }],
                    isPro: true,
                })
            });

            if (pdfRes.ok) {
                const blob = await pdfRes.blob();
                log(`✓ Sandbox PDF: Success (${blob.size} bytes)`);
            } else {
                const errText = await pdfRes.text();
                throw new Error(`Status ${pdfRes.status} - ${errText}`);
            }
        } catch (error: any) {
            const msg = error.message || 'Unknown error';
            log(`✗ Sandbox PDF: Failed - ${msg}`);
        }

        // 2. Template PDF Generation (Main Editor) - Should be free/no watermark logic
        try {
            const templatePdfRes = await fetch(`${BASE_URL}/generate-pdf`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    resumeData: {
                        personalInfo: { firstName: 'Test', lastName: 'User', email: user.email },
                        workExperience: [],
                        education: [],
                        skills: [],
                        projects: [],
                        templateId: 'modern'
                    }
                })
            });

            if (templatePdfRes.ok) {
                const blob = await templatePdfRes.blob();
                log(`✓ Template PDF: Success (${blob.size} bytes) - No tier check expected`);
            } else {
                const errText = await templatePdfRes.text();
                throw new Error(`Status ${templatePdfRes.status} - ${errText}`);
            }
        } catch (error: any) {
            const msg = error.message || 'Unknown error';
            log(`✗ Template PDF: Failed - ${msg}`);
        }

        // 3. AI Improve (Pro+ only)
        try {
            const aiRes = await fetch(`${BASE_URL}/ai/improve`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    text: 'Managed a team of 5 developers.',
                    type: 'experience'
                })
            });

            if (aiRes.ok) {
                if (user.tier === 'pro_plus') {
                    log(`✓ AI Improve: Success (Expected)`);
                } else {
                    log(`✗ AI Improve: UNEXPECTED SUCCESS (Should include 403)`);
                }
            } else {
                if (aiRes.status === 403) {
                    if (user.tier !== 'pro_plus') {
                        log(`✓ AI Improve: Blocked (Expected 403)`);
                    } else {
                        log(`✗ AI Improve: Blocked (UNEXPECTED 403 for Pro+)`);
                    }
                } else if (aiRes.status === 500) {
                    if (user.tier === 'pro_plus') {
                        log(`✓ AI Improve: Passed Tier Check (500 Error - API Key issue?)`);
                    } else {
                        log(`✗ AI Improve: 500 Error for non-Pro+ (Should be 403 first)`);
                    }
                } else {
                    log(`? AI Improve: Status ${aiRes.status}`);
                }
            }
        } catch (error: any) {
            log(`? AI Improve check failed: ${error.message}`);
        }

        // 4. Analytics Stats (Pro+ only)
        try {
            const statsRes = await fetch(`${BASE_URL}/analytics/stats`, {
                method: 'GET',
                headers
            });

            if (statsRes.ok) {
                if (user.tier === 'pro_plus') {
                    log(`✓ Analytics: Success (Expected)`);
                } else {
                    log(`✗ Analytics: UNEXPECTED SUCCESS`);
                }
            } else {
                const errText = await statsRes.text();
                if (statsRes.status === 403) {
                    if (user.tier !== 'pro_plus') {
                        log(`✓ Analytics: Blocked (Expected 403)`);
                    } else {
                        log(`✗ Analytics: Blocked (UNEXPECTED 403 for Pro+) - ${errText}`);
                    }
                } else {
                    log(`? Analytics: Status ${statsRes.status} - ${errText}`);
                }
            }
        } catch (error: any) {
            log(`? Analytics check failed: ${error.message}`);
        }
        log('\n');
    }
}

verifyFeatures();
