import fs from 'fs';
import crypto from 'crypto';

const credsPath = 'C:\\Users\\keker\\Desktop\\iracing_creds.txt';
if (!fs.existsSync(credsPath)) {
    console.error('Credentials file not found at', credsPath);
    process.exit(1);
}

const lines = fs.readFileSync(credsPath, 'utf-8').split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
if (lines.length < 2) {
    console.error('Credentials file must have email on line 1 and password on line 2');
    process.exit(1);
}

const email = lines[0];
const password = lines[1];

function hashPassword(pass, mail) {
    const combined = pass + mail.toLowerCase();
    return crypto.createHash('sha256').update(combined).digest('base64');
}

async function loginAndGetDocs() {
    try {
        console.log('Authenticating with iRacing Data API...');
        const payload = {
            email: email,
            password: hashPassword(password, email)
        };

        const authRes = await fetch('https://members-ng.iracing.com/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!authRes.ok) {
            console.error('Auth failed!', authRes.status, await authRes.text());
            return;
        }

        console.log('Successfully authenticated!');

        // Get the cookies
        const cookies = authRes.headers.getSetCookie();
        if (!cookies || cookies.length === 0) {
            console.error("No cookies returned from auth");
            return;
        }

        // The cookie we probably care about is 'iracing-auth' and 'iracing-cookie'
        const cookieStr = cookies.map(c => c.split(';')[0]).join('; ');

        console.log('Fetching API documentation directory...');
        // Hit the /data/doc endpoint
        const docRes = await fetch('https://members-ng.iracing.com/data/doc', {
            headers: {
                'Cookie': cookieStr
            }
        });

        if (!docRes.ok) {
            console.error('Failed to get /data/doc', docRes.status);
            return;
        }

        const docs = await docRes.json();
        
        console.log("\n=================== API CATEGORIES AND ENDPOINTS ===================");
        const categories = {};
        for (const category of Object.keys(docs)) {
            categories[category] = Object.keys(docs[category]);
        }
        
        console.log(JSON.stringify(categories, null, 2));
        console.log("====================================================================\n");
        console.log("Ready for analysis!");

    } catch (err) {
        console.error("Error:", err);
    }
}

loginAndGetDocs();
