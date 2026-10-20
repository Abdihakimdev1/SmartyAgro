// ============================================================
// SMARTY SYSTEM - MODERN JAVASCRIPT
// ============================================================

// --- MODERN TOAST NOTIFICATION SYSTEM ---
function showToast(message, type = 'info') {
    let host = document.getElementById('toast-host');
    if (!host) {
        host = document.createElement('div');
        host.id = 'toast-host';
        document.body.appendChild(host);
    }

    const icons = {
        info: 'ph-fill ph-info',
        success: 'ph-fill ph-check-circle',
        error: 'ph-fill ph-warning-circle',
        warning: 'ph-fill ph-warning'
    };

    const titles = {
        info: 'Information',
        success: 'Success',
        error: 'Error',
        warning: 'Warning'
    };

    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
    <i class="${icons[type] || icons.info}"></i>
    <div class="toast-content">
    <div class="toast-title">${titles[type] || titles.info}</div>
    <div class="toast-message">${message}</div>
    </div>
    `;

    host.appendChild(el);
    requestAnimationFrame(() => {
        el.classList.add('show');
    });

    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 350);
    }, 3500);
}

// Override native alert with modern toast
const nativeAlert = window.alert;
window.alert = (message) => {
    const msg = String(message);
    let type = 'info';
    if (/cilad|error|incorrect|invalid|lama|failed/i.test(msg)) type = 'error';
    else if (/guul|success|successfully|waa la kaydiyay|dhacday/i.test(msg)) type = 'success';
    showToast(msg, type);
};

// ============================================================
// CONFIGURATION
// ============================================================
// NOTE: no passwords or PINs live in this file. Access is enforced by Supabase Auth + database RLS.

const SUPABASE_URL = "https://supvvuzyuaptstedwqsu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cHZ2dXp5dWFwdHN0ZWR3cXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3Nzk1MTAsImV4cCI6MjEwMTM1NTUxMH0.ckQMVEK-k_djzbsXg68WZTPf9j0rnH6dsn9h63cV3iQ";
// "Remember me" -> session kept in localStorage; otherwise only for this browser tab.
const authStorage = {
    getItem: k => localStorage.getItem(k) ?? sessionStorage.getItem(k),
    setItem: (k, v) => (localStorage.getItem('smarty_remember') === '0' ? sessionStorage : localStorage).setItem(k, v),
    removeItem: k => { localStorage.removeItem(k); sessionStorage.removeItem(k); }
};
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { storage: authStorage, persistSession: true, autoRefreshToken: true }
});

// ============================================================
// DYNAMIC PAYMENT METHODS
// ============================================================
const paymentMethodsData = {
    SLSH: [{
        label: "Cash — SLSH",
        value: "Cash SLSH"
    },
        {
            label: "Cash — USD",
            value: "Cash USD"
        },
        {
            label: "ZAAD — SLSH",
            value: "ZAAD SLSH"
        },
        {
            label: "ZAAD — USD",
            value: "ZAAD USD"
        },
        {
            label: "eDahab — SLSH",
            value: "eDahab SLSH"
        },
        {
            label: "eDahab — USD",
            value: "eDahab USD"
        },
        {
            label: "Kaash Plus — SLSH",
            value: "Kaash Plus SLSH"
        },
        {
            label: "Darasalaam Bank — SLSH",
            value: "Darasalaam Bank SLSH"
        },
        {
            label: "Darasalaam Bank — USD",
            value: "Darasalaam Bank USD"
        },
        {
            label: "Dahabshiil Bank — SLSH",
            value: "Dahabshiil Bank SLSH"
        },
        {
            label: "Dahabshiil Bank — USD",
            value: "Dahabshiil Bank USD"
        },
        {
            label: "Other / Transfer",
            value: "Other Transfer"
        }],
    ETB: [{
        label: "Cash — ETB",
        value: "Cash ETB"
    },
        {
            label: "eBirr — ETB",
            value: "eBirr ETB"
        },
        {
            label: "eBirr Kaafi — ETB",
            value: "eBirr Kaafi ETB"
        },
        {
            label: "Coopay eBirr — ETB",
            value: "Coopay eBirr ETB"
        },
        {
            label: "Telebirr — ETB",
            value: "Telebirr ETB"
        },
        {
            label: "M-Pesa — ETB",
            value: "M-Pesa ETB"
        },
        {
            label: "KaafiMF Bank — ETB",
            value: "KaafiMF Bank ETB"
        },
        {
            label: "CBE Bank — ETB",
            value: "CBE Bank ETB"
        },
        {
            label: "COOP Bank — ETB",
            value: "COOP Bank ETB"
        },
        {
            label: "Other / Transfer",
            value: "Other Transfer"
        }]
};

// ============================================================
// LANGUAGE DATA
// ============================================================
const languages = {
    so: {
        subTitle: "Maamulka Lacagaha",
        menuDashboard: "Dashboard",
        menuSave: "Kaydin",
        menuLoan: "Amaahda",
        menuExchange: "Sarifka",
        menuSettings: "Habaynta",
        menuLogout: "Ka Bax",
        titleDashboard: "Dashboard Groups",
        titleSave: "Kaydka Lacagta",
        titleLoan: "Maamulka Amaahda",
        titleExchange: "Sarifka Lacagaha",
        titleSettings: "Settings"
    },
    en: {
        subTitle: "Money Management",
        menuDashboard: "Dashboard",
        menuSave: "Savings",
        menuLoan: "Loans",
        menuExchange: "Exchange",
        menuSettings: "Settings",
        menuLogout: "Logout",
        titleDashboard: "Group Dashboard",
        titleSave: "Savings Management",
        titleLoan: "Loan Management",
        titleExchange: "Currency Exchange",
        titleSettings: "System Settings"
    }
};

const fullLanguageMap = {
    en: {
        "Secure System": "Nidaam Ammaan ah",
        "Please select role and enter password": "Dooro role-ka oo geli password-kaaga",
        "Select Option (Role)": "Dooro Doorka",
        "Password": "Password",
        "Login System": "Gal Nidaamka",
        "Money Management": "Maamulka Lacagaha",
        "Poultry Business": "Ganacsiga Digaagga",
        "Livestock": "Xoolaha",
        "Crypto Trade": "Ganacsiga Crypto",
        "Save": "Kaydin",
        "Savings": "Kaydka",
        "Loans": "Amaahda",
        "Exchange": "Sarifka",
        "Settings": "Settings",
        "Logout": "Ka Bax",
        "Welcome back!": "Soo dhawoow!",
        "Your system is currently open, and your data has been saved.": "Nidaamku wuu furan yahay, xogtana waa la kaydiyay.",
        "Activity": "Hawlaha",
        "Business Activity": "Hawlaha Ganacsiga",
        "Distribution": "Qaybinta",
        "System Overview": "Guudmarka Nidaamka",
        "Records": "Diiwaanno",
        "Customer Name": "Magaca Macmiilka",
        "Item Name": "Magaca Alaabta",
        "Quantity": "Tirada",
        "Price per Item": "Qiimaha Midkiiba",
        "Price": "Qiimaha",
        "Currency": "Lacagta",
        "Payment Method": "Habka Lacag-bixinta",
        "Date": "Taariikhda",
        "Save": "Kaydi",
        "Save And Generate Receipt": "Kaydi oo Same Rasiid",
        "Animal Type": "Nooca Xoolaha",
        "Crypto Trade Management": "Maamulka Crypto Trade",
        "Crypto Type": "Nooca Crypto",
        "Buy Price ($)": "Qiimaha Iibsiga ($)",
        "Sell Price ($)": "Qiimaha Iibka ($)",
        "Save trade": "Kaydi Trade",
        "Save management": "Maamulka Kaydka",
        "Amount": "Lacagta",
        "Currency type": "Nooca Lacagta",
        "Deposit": "Ku Dar",
        "Withdraw": "La Bax",
        "Add new loan": "Ku Dar Amaah Cusub",
        "Name": "Magaca",
        "Loan amount": "Lacagta Amaahda",
        "Currency type": "Nooca Lacagta",
        "Save Loan": "Kaydi Amaah",
        "Exchange": "Sarifka",
        "Available Balance": "Lacagta aad haysato",
        "Sarif": "Sarif",
        "1. System Theme (Muuqaalka Nidaamka)": "1. Muuqaalka Nidaamka",
        "Smarty Green": "Smarty Green",
        "Dark Pro": "Dark Pro",
        "2. Profile Image": "2. Sawirka Profile-ka",
        "3. Language": "3. Luuqadda",
        "4. Maamulka Xogta": "4. Maamulka Xogta",
        "Export": "Ladagid",
        "Import": "So Galin",
        "Restore System": "Soo Celinta Nidaamka",
        "Poultry Business Log": "Diiwaanka Ganacsiga Digaagga",
        "Livestock Management Log": "Diiwaanka Maamulka Xoolaha",
        "Crypto Trade Performance Log": "Diiwaanka Waxqabadka Crypto",
        "Loans & Debts": "Amaahda iyo Daymaha",
        "Savings Balances": "Hadhaaga Kaydka",
        "Customer": "Macmiil",
        "Item": "Alaab",
        "Qty": "Tiro",
        "Total": "Wadar",
        "Payment": "Lacag-bixin",
        "Action": "Ficil",
        "Total Value": "Wadarta Qiimaha",
        "Coin": "Coin",
        "Capital Flow": "Socodka Raasumaalka",
        "Net Profit": "Faa'iidada Saafida",
        "Loan Date": "Taariikh",
        "Debtor": "Qofka Amaahda",
        "Amount": "Lacag",
        "Status": "Xaalad",
        "Balance": "Hadhaaga",
        "Last Updated": "Cusboonaysiintii Ugu Dambaysay"
    },
    so: {
        "Nidaam Ammaan ah": "Secure System",
        "Dooro doorka oo geli password-ka": "Please select role and enter password",
        "Dooro Doorka": "Select Option (Role)",
        "Password": "Password",
        "Gal Nidaamka": "Login System",
        "Maamulka Lacagaha": "Money Management",
        "Ganacsiga Digaagga": "Poultry Business",
        "Xoolaha": "Livestock",
        "Ganacsiga Crypto": "Crypto Trade",
        "Kaydin": "Save",
        "Kaydka": "Savings",
        "Amaahda": "Loans",
        "Sarifka": "Exchange",
        "Settings": "Settings",
        "Ka Bax": "Logout",
        "Soo dhawoow!": "Welcome back!",
        "Nidaamku wuu furan yahay, xogtana waa la kaydiyay.": "Your system is currently open, and your data has been saved.",
        "Hawlaha": "Activity",
        "Hawlaha Ganacsiga": "Business Activity",
        "Qaybinta": "Distribution",
        "Guudmarka Nidaamka": "System Overview",
        "Diiwaanno": "Records",
        "Magaca Macmiilka": "Customer Name",
        "Magaca Alaabta": "Item Name",
        "Tirada": "Quantity",
        "Qiimaha Midkiiba": "Price per Item",
        "Qiimaha": "Price",
        "Lacagta": "Currency",
        "Habka Lacag-bixinta": "Payment Method",
        "Taariikhda": "Date",
        "KAYDI": "SAVE",
        "KAYDI OO SAMEE RECEIPT": "SAVE AND GENERATE RECEIPT",
        "Nooca Xoolaha": "Animal Type",
        "Maamulka Crypto Trade": "Crypto Trade Management",
        "Nooca Crypto": "Crypto Type",
        "Qiimaha Iibsiga ($)": "Buy Price ($)",
        "Qiimaha Iibka ($)": "Sell Price ($)",
        "Kaydi Trade": "Save trade",
        "Maamulka Kaydka": "Save management",
        "Lacagta": "Lacagta (Amount)",
        "Nooca Lacagta": "Currency type",
        "Ku Dar": "Deposit",
        "La Bax": "Withdraw",
        "Ku Dar Amaah Cusub": "Add new loan",
        "Magaca": "Name",
        "Lacagta Amaahda": "Loan amount",
        "Kaydi Amaah": "Save Loan",
        "Sarifka": "Exchange",
        "Lacagta aad haysato": "Amount to Exchange",
        "Sarif": "Convert",
        "1. Muuqaalka Nidaamka": "1. System Theme (Muuqaalka Nidaamka)",
        "2. Sawirka Profile-ka": "2. Profile Picture",
        "3. Luuqadda": "3. Language",
        "4. Maamulka Xogta": "4. Data Management",
        "Dhoofin": "Export",
        "Soo-dejin": "Import",
        "Soo Celinta Nidaamka": "Restore System",
        "Diiwaanka Ganacsiga Digaagga": "Poultry Business Log",
        "Diiwaanka Maamulka Xoolaha": "Livestock Management Log",
        "Diiwaanka Waxqabadka Crypto": "Crypto Trade Performance Log",
        "Amaahda iyo Daymaha": "Loans & Debts",
        "Hadhaaga Kaydka": "Savings Balances",
        "Macmiil": "Customer",
        "Alaab": "Item",
        "Tiro": "Qty",
        "Wadar": "Total",
        "Lacag-bixin": "Payment",
        "Ficil": "Action",
        "Wadarta Qiimaha": "Total Value",
        "Coin": "Coin",
        "Socodka Raasumaalka": "Capital Flow",
        "Faa'iidada Saafida": "Net Profit",
        "Qofka Amaahda": "Debtor",
        "Xaalad": "Status",
        "Hadhaaga": "Balance",
        "Cusboonaysiintii Ugu Dambaysay": "Last Updated"
    }
};

function translateStaticUI() {
    const lang = systemData.settings.lang || 'so';
    const map = fullLanguageMap[lang] || fullLanguageMap.en;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while (n = walker.nextNode()) nodes.push(n);
    nodes.forEach(node => {
        if (!node.nodeValue || !node.nodeValue.trim()) return;
        const raw = node.nodeValue.trim();
        if (map[raw]) node.nodeValue = node.nodeValue.replace(raw, map[raw]);
    });
    const search = document.getElementById('dashboard-search-top');
    if (search) search.placeholder = lang === 'so' ? 'Raadi nidaamka...': 'Search system...';
}

// ============================================================
// GLOBAL STATE
// ============================================================
let systemData = {
    sales: [],
    savings: {
        USD: 0,
        SLSH: 0,
        ETB: 0
    },
    loans: [],
    settings: {
        theme: 'green',
        lang: 'so',
        profilePic: ''
    }
};
let activeTab = 'dashboard';
let isMobileMenuOpen = false;

// ============================================================
// INITIALIZATION
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
    initClock();
    checkLoginState();
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('poultry-date')) document.getElementById('poultry-date').value = today;
    if (document.getElementById('live-date')) document.getElementById('live-date').value = today;

    updatePaymentMethods('poultry');
    updatePaymentMethods('livestock');
});

// ============================================================
// PAYMENT METHODS
// ============================================================
function updatePaymentMethods(section) {
    // Livestock form fields use the "live-" prefix (live-currency / live-payment),
    // poultry uses "poultry-". Map the section name to the real element prefix.
    const prefix = section === 'livestock' ? 'live': section;
    const currencySelect = document.getElementById(`${prefix}-currency`);
    const paymentSelect = document.getElementById(`${prefix}-payment`);
    if (!currencySelect || !paymentSelect) return;

    const selectedCurrency = currencySelect.value;
    const options = paymentMethodsData[selectedCurrency] || [];

    paymentSelect.innerHTML = '';
    options.forEach(opt => {
        const optionElem = document.createElement('option');
        optionElem.value = opt.value;
        optionElem.innerText = opt.label;
        if (opt.disabled) optionElem.disabled = true;
        paymentSelect.appendChild(optionElem);
    });
}

// ============================================================
// DASHBOARD SEARCH
// ============================================================
function syncDashboardSearch(value) {
    const input = document.getElementById('dashboard-search');
    if (input) input.value = value;
    searchAllSystemData();
}

function searchAllSystemData() {
    const query = (document.getElementById('dashboard-search')?.value || '').toLowerCase().trim();
    const counter = document.getElementById('search-counter');
    const resultCount = document.getElementById('result-count');
    let totalMatches = 0;

    const dataGroups = document.querySelectorAll('.data-group-card');

    dataGroups.forEach(group => {
        const rows = group.querySelectorAll('tbody tr');
        let groupHasMatches = false;

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            if (query === "" || text.includes(query)) {
                row.classList.remove('hidden');
                groupHasMatches = true;
                if (query !== "") totalMatches++;
            } else {
                row.classList.add('hidden');
            }
        });

        if (groupHasMatches || query === "") {
            group.classList.remove('hidden');
        } else {
            group.classList.add('hidden');
        }
    });

    if (counter && resultCount) {
        if (query !== "") {
            counter.classList.remove('hidden');
            resultCount.innerText = totalMatches;
        } else {
            counter.classList.add('hidden');
        }
    }
}

// ============================================================
// DASHBOARD CHARTS
// ============================================================
function renderDashboardCharts() {
    const sales = systemData.sales || [];
    const poultry = sales.filter(s => s.type === 'POULTRY').length;
    const livestock = sales.filter(s => s.type === 'LIVESTOCK').length;
    const crypto = sales.filter(s => s.type === 'CRYPTO').length;
    const loan = (systemData.loans || []).length;
    const values = [poultry,
        livestock,
        crypto,
        loan];
    const labels = ['Poultry',
        'Livestock',
        'Crypto',
        'Loans'];
    const max = Math.max(...values, 1);

    const bar = document.getElementById('activity-chart');
    if (bar) {
        bar.innerHTML = values.map((v, i) => `
            <div class="bar-item">
            <div class="bar-track">
            <div class="bar-fill" style="height:${Math.max(8, (v / max) * 100)}%">
            <span>${v}</span>
            </div>
            </div>
            <small>${labels[i]}</small>
            </div>
            `).join('');
    }

    const total = values.reduce((a, b) => a + b, 0);
    const donut = document.getElementById('overview-chart');
    const legend = document.getElementById('overview-legend');
    const totalEl = document.getElementById('overview-total');

    if (totalEl) totalEl.innerText = total;

    if (donut) {
        const p = total ? Math.round((poultry / total) * 100): 0;
        const l = total ? Math.round((livestock / total) * 100): 0;
        const c = total ? Math.round((crypto / total) * 100): 0;
        donut.classList.toggle('empty', total === 0);
        donut.style.setProperty('--poultry', p + '%');
        donut.style.setProperty('--livestock', (p + l) + '%');
        donut.style.setProperty('--crypto', (p + l + c) + '%');
    }

    if (legend) {
        legend.innerHTML = labels.map((label, i) =>
            `<span><i class="legend-dot dot-${i}"></i>${label}<strong>${values[i]}</strong></span>`
        ).join('');
    }
}

// ============================================================
// MODERN LOADING SCREEN
// ============================================================
function showLoading(text = "Please wait...", duration = 800, callback = null) {
    const screen = document.getElementById('loading-screen');
    if (!screen) {
        if (callback) callback(); return;
    }

    const label = document.getElementById('loading-label');
    if (label) label.innerText = text;

    screen.classList.remove('hidden');

    setTimeout(() => {
        screen.classList.add('hidden');
        if (callback) callback();
    },
        duration);
}

// ============================================================
// AUTHENTICATION
// ============================================================
function togglePasswordVisibility() {
    const passwordField = document.getElementById('login-password');
    const eyeIcon = document.getElementById('eye-icon');
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.className = "ph-bold ph-eye-slash toggle-password";
    } else {
        passwordField.type = "password";
        eyeIcon.className = "ph-bold ph-eye toggle-password";
    }
}

// ============================================================
// AUTHENTICATION (Supabase Auth + phone check) AND ROLES
// ============================================================
let currentStaff = null; // { user_id, email, phone, display_name, role, permissions }
const ROLE_LABEL = { admin: 'Admin', manager: 'Manager', staff: 'Staff' };

function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function hasPerm(key) {
    return !!currentStaff && (currentStaff.role === 'admin' || (currentStaff.permissions || []).includes(key));
}
function isAdmin() { return !!currentStaff && currentStaff.role === 'admin'; }
function canManageStaff() { return isAdmin() || hasPerm('staff.manage'); }

function setLoginMessage(msg, ok) {
    const el = document.getElementById('login-message');
    if (!el) return;
    el.innerText = msg || '';
    el.classList.toggle('ok', !!ok);
}
function selectQuickRole(role) { // only pre-selects the account type - no credentials are stored or skipped
    document.getElementById('login-role').value = role;
    document.querySelectorAll('.quick-role').forEach(b => b.classList.toggle('active', b.dataset.role === role));
}
function showForgotPassword() {
    setLoginMessage('Forgot your password? Ask your Admin to reset it from Settings > Staff & Roles.', true);
}

async function loadCurrentStaff() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return null;
    // RLS returns this row only for an active staff member whose session passed the phone check.
    const { data, error } = await sb.from('smarty_staff')
        .select('user_id,email,phone,display_name,role,permissions,active')
        .eq('user_id', session.user.id).maybeSingle();
    if (error || !data || !data.active) return null;
    return data;
}

function showAuthScreen() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
}

function showApp() {
    const label = currentStaff.display_name || ROLE_LABEL[currentStaff.role] || 'Staff';
    sessionStorage.setItem('system_save_role', label); // display only - never trusted for access
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    document.getElementById('user-role-badge').innerText = ROLE_LABEL[currentStaff.role] || currentStaff.role;
    const topRole = document.getElementById('topbar-role');
    if (topRole) topRole.innerText = ROLE_LABEL[currentStaff.role] || currentStaff.role;
    applyPermissionsUI();
    initApp();
}

async function checkLoginState() {
    const staff = await loadCurrentStaff();
    if (staff) {
        currentStaff = staff;
        showApp();
    } else {
        const { data: { session } } = await sb.auth.getSession();
        if (session) await sb.auth.signOut(); // signed in but not an authorized, verified session
        currentStaff = null;
        showAuthScreen();
    }
}

async function loginLocalUser() {
    const roleSel = document.getElementById('login-role').value;
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('login-remember').checked;
    const btn = document.getElementById('login-submit');

    if (!email || !phone || !password) { setLoginMessage('Please enter your email, phone and password.'); return; }
    setLoginMessage('');
    btn.disabled = true;

    const fail = async (msg) => { try { await sb.auth.signOut(); } catch (_) {} setLoginMessage(msg); btn.disabled = false; };
    try {
        localStorage.setItem('smarty_remember', remember ? '1' : '0');
        [localStorage, sessionStorage].forEach(st => Object.keys(st).filter(k => k.startsWith('sb-')).forEach(k => st.removeItem(k)));

        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (error || !data || !data.session) return fail('Incorrect email, phone or password.');

        const { data: v, error: vErr } = await sb.rpc('smarty_verify_phone', { p_phone: phone });
        if (vErr || v !== 'ok') {
            return fail(v === 'locked' ? 'Too many wrong attempts. Try again later or ask your Admin to unlock you.'
                : v === 'not_authorized' ? 'This account is not allowed to use Smarty System.'
                : 'Incorrect email, phone or password.');
        }
        const staff = await loadCurrentStaff();
        if (!staff) return fail('This account is not allowed to use Smarty System.');
        if (staff.role !== roleSel) return fail(`This is not a ${ROLE_LABEL[roleSel]} account. Choose the correct role.`);

        showLoading("Opening system...", 1200, () => {
            currentStaff = staff;
            showApp();
            btn.disabled = false;
            document.getElementById('login-password').value = '';
            const banner = document.getElementById('welcome-banner');
            const welcomeText = document.getElementById('welcome-text');
            if (welcomeText) welcomeText.innerText = `Welcome back, ${staff.display_name || ROLE_LABEL[staff.role]}!`;
            if (banner) {
                banner.classList.remove('hidden');
                setTimeout(() => banner.classList.add('hidden'), 5000);
            }
        });
    } catch (err) {
        console.error('Login error');
        fail('Could not sign in. Check your connection and try again.');
    }
}

function logoutLocalUser() {
    if (confirm("Are you sure you want to logout?")) {
        showLoading("Saving data safely...", 1000, async () => {
            await sb.auth.signOut();
            currentStaff = null;
            sessionStorage.removeItem('system_save_role');
            setLoginMessage('');
            showAuthScreen();
        });
    }
}

sb.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT' && currentStaff) { currentStaff = null; showAuthScreen(); }
});

// ---------- password / secret prompt (replaces prompt() and hardcoded comparisons) ----------
let secretResolver = null;
function askSecret(title, text) {
    return new Promise(resolve => {
        secretResolver = resolve;
        document.getElementById('secret-title').innerHTML = '<i class="ph-fill ph-lock-simple"></i> ' + esc(title);
        document.getElementById('secret-text').innerText = text || '';
        const input = document.getElementById('secret-input');
        input.value = '';
        document.getElementById('secret-modal').classList.remove('hidden');
        setTimeout(() => input.focus(), 60);
    });
}
function closeSecretModal(value) {
    document.getElementById('secret-modal').classList.add('hidden');
    document.getElementById('secret-input').value = '';
    if (secretResolver) { const r = secretResolver; secretResolver = null; r(value); }
}
window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('secret-input');
    if (input) input.addEventListener('keydown', e => {
        if (e.key === 'Enter') closeSecretModal(input.value);
        if (e.key === 'Escape') closeSecretModal(null);
    });
});

// Re-checks the signed-in user's own password on the server (separate client, so the current session is untouched).
async function confirmWithPassword(text) {
    const pass = await askSecret('Confirm with your password', text);
    if (!pass) return false;
    const tmp = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'smarty-reauth' }
    });
    const { error } = await tmp.auth.signInWithPassword({ email: currentStaff.email, password: pass });
    if (error) { showToast('Incorrect password.', 'error'); return false; }
    return true;
}

// ---------- what each role may see (the database enforces the real rules) ----------
function canOpenTab(tabId) {
    switch (tabId) {
        case 'poultry': return hasPerm('poultry.view') || hasPerm('poultry.add');
        case 'livestock': return hasPerm('livestock.view') || hasPerm('livestock.add');
        case 'crypto': return hasPerm('crypto.view') || hasPerm('crypto.add');
        case 'save-money': return hasPerm('savings.view') || hasPerm('savings.update');
        case 'loan': return hasPerm('loans.view') || hasPerm('loans.add') || hasPerm('loans.update');
        default: return true; // dashboard, exchange calculator, settings
    }
}
function denied() { showToast("Ma haysatid ogolaansho (You don't have permission).", 'error'); }

function applyPermissionsUI() {
    document.querySelectorAll('button[data-tab]').forEach(btn => btn.classList.toggle('hidden', !canOpenTab(btn.dataset.tab)));
    document.querySelectorAll('.quick-card, .bn-fab').forEach(btn => {
        const m = /switchTabSecure\('([a-z-]+)'\)/.exec(btn.getAttribute('onclick') || '');
        if (m) btn.classList.toggle('hidden', !canOpenTab(m[1]));
    });
    const groups = { poultry: 'poultry.view', livestock: 'livestock.view', crypto: 'crypto.view', loans: 'loans.view', savings: 'savings.view' };
    document.querySelectorAll('.data-group-card').forEach(c => c.classList.toggle('hidden', !hasPerm(groups[c.dataset.group])));
    const stats = [...document.querySelectorAll('.grid-dash-totals .card')];
    ['poultry.view', 'livestock.view', 'crypto.view', 'loans.view'].forEach((k, i) => { if (stats[i]) stats[i].classList.toggle('hidden', !hasPerm(k)); });

    const anyDel = ['poultry', 'livestock', 'crypto'].some(a => hasPerm(a + '.delete'));
    document.body.classList.toggle('np-del-sale', !anyDel);
    document.body.classList.toggle('np-del-loan', !hasPerm('loans.delete'));
    document.body.classList.toggle('np-refund', !hasPerm('loans.update'));

    const show = (id, on) => { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', !on); };
    show('settings-staff', canManageStaff());
    show('settings-audit', isAdmin());
    show('btn-export', hasPerm('data.export'));
    show('lbl-import', isAdmin());
    show('btn-restore', isAdmin());
}

function onSettingsOpen() {
    const info = document.getElementById('account-info');
    if (info && currentStaff) info.innerText = `${currentStaff.display_name || ''} ${currentStaff.display_name ? '- ' : ''}${currentStaff.email} - ${ROLE_LABEL[currentStaff.role]}`;
    if (canManageStaff()) renderStaffList();
    if (isAdmin()) loadAuditLog();
}

function validNewPassword(p) { return typeof p === 'string' && p.length >= 10 && /[A-Za-z]/.test(p) && /\d/.test(p); }

async function changeMyPassword() {
    const input = document.getElementById('new-password');
    if (!validNewPassword(input.value)) { showToast('Password must be at least 10 characters with letters and numbers.', 'error'); return; }
    const { error } = await sb.auth.updateUser({ password: input.value });
    if (error) { showToast('Could not change the password. Sign in again and retry.', 'error'); return; }
    input.value = '';
    showToast('Password changed.', 'success');
}

// ============================================================
// STAFF & ROLES (Admin, or Manager with "manage staff")
// ============================================================
const PERM_GROUPS = [
    ['Poultry', [['poultry.view', 'View'], ['poultry.add', 'Add sale'], ['poultry.delete', 'Delete']]],
    ['Livestock', [['livestock.view', 'View'], ['livestock.add', 'Add'], ['livestock.delete', 'Delete']]],
    ['Crypto', [['crypto.view', 'View'], ['crypto.add', 'Add trade'], ['crypto.delete', 'Delete']]],
    ['Loans', [['loans.view', 'View'], ['loans.add', 'Add loan'], ['loans.update', 'Mark refunded'], ['loans.delete', 'Delete']]],
    ['Savings', [['savings.view', 'View'], ['savings.update', 'Deposit / withdraw']]],
    ['General', [['settings.edit', 'Change shared settings'], ['data.export', 'Export data']]]
];
const PERM_PRESETS = {
    cashier: ['poultry.view', 'poultry.add', 'livestock.view', 'livestock.add', 'savings.view'],
    employee: ['poultry.view', 'livestock.view']
};
let staffCache = [];

async function staffApi(action, payload = {}) {
    const { data, error } = await sb.functions.invoke('smarty-admin', { body: { action, ...payload } });
    if (error) {
        let msg = 'Request failed. Try again.';
        try { const j = await error.context.json(); if (j && j.error) msg = j.error; } catch (_) {}
        return { ok: false, error: msg };
    }
    if (data && data.error) return { ok: false, error: data.error };
    return { ok: true, data };
}

async function renderStaffList() {
    const body = document.getElementById('staff-table-body');
    if (!body) return;
    const r = await staffApi('list');
    if (!r.ok) { body.innerHTML = `<tr><td colspan="5" class="no-results-msg">${esc(r.error)}</td></tr>`; return; }
    staffCache = r.data.staff || [];
    if (!staffCache.length) { body.innerHTML = '<tr><td colspan="5" class="no-results-msg">No people yet.</td></tr>'; return; }
    body.innerHTML = staffCache.map(u => {
        const locked = u.locked_until && new Date(u.locked_until) > new Date();
        const self = u.user_id === currentStaff.user_id;
        return `<tr>
            <td><strong>${esc(u.display_name || '-')}</strong>${self ? ' <small>(you)</small>' : ''}</td>
            <td><span class="status-badge">${esc(ROLE_LABEL[u.role] || u.role)}</span></td>
            <td><small>${esc(u.email)}<br>+${esc(u.phone)}</small></td>
            <td>${u.active ? (locked ? '<span class="status-badge status-pending">Locked</span>' : '<span class="status-badge status-refunded">Active</span>') : '<span class="status-badge status-pending">Disabled</span>'}</td>
            <td class="staff-actions">
                <button class="btn btn-sm" onclick="openStaffModal('${u.user_id}')"><i class="ph-bold ph-pencil-simple"></i> Edit</button>
                <button class="btn btn-sm btn-ghost" onclick="resetStaffPassword('${u.user_id}')"><i class="ph-bold ph-key"></i> Password</button>
                ${locked ? `<button class="btn btn-sm btn-ghost" onclick="unlockStaff('${u.user_id}')"><i class="ph-bold ph-lock-open"></i> Unlock</button>` : ''}
                ${self ? '' : `<button class="btn btn-sm btn-ghost" onclick="toggleStaffActive('${u.user_id}', ${u.active ? 'false' : 'true'})">${u.active ? 'Disable' : 'Enable'}</button>`}
            </td></tr>`;
    }).join('');
}

function renderPermGrid(selected) {
    const role = document.getElementById('staff-role').value;
    const mine = new Set(isAdmin() ? PERM_GROUPS.flatMap(g => g[1].map(p => p[0])).concat(['staff.manage']) : (currentStaff.permissions || []));
    const groups = PERM_GROUPS.slice();
    if (isAdmin() && role === 'manager') groups.push(['Administration', [['staff.manage', 'Manage staff accounts']]]);
    document.getElementById('staff-perms').innerHTML = groups.map(([name, items]) => `
        <div class="perm-group"><strong>${esc(name)}</strong>${items.map(([key, label]) => `
            <label class="perm-item ${mine.has(key) ? '' : 'disabled'}">
                <input type="checkbox" data-perm="${key}" ${selected.includes(key) ? 'checked' : ''} ${mine.has(key) ? '' : 'disabled'}> ${esc(label)}
            </label>`).join('')}</div>`).join('');
}
function currentPermSelection() {
    return [...document.querySelectorAll('#staff-perms input[data-perm]:checked')].map(i => i.dataset.perm);
}
function onStaffRoleChange() {
    const role = document.getElementById('staff-role').value;
    const isAdminRole = role === 'admin';
    document.getElementById('staff-perms').classList.toggle('hidden', isAdminRole);
    document.getElementById('staff-preset-group').classList.toggle('hidden', isAdminRole);
    renderPermGrid(currentPermSelection());
}
function applyStaffPreset() {
    const key = document.getElementById('staff-preset').value;
    if (!key) return;
    const allowed = isAdmin() ? PERM_PRESETS[key] : PERM_PRESETS[key].filter(p => (currentStaff.permissions || []).includes(p));
    renderPermGrid(allowed);
}

function openStaffModal(userId) {
    const u = userId ? staffCache.find(x => x.user_id === userId) : null;
    document.getElementById('staff-modal-title').innerHTML = u ? '<i class="ph-fill ph-user-gear"></i> Edit person' : '<i class="ph-fill ph-user-plus"></i> Add person';
    document.getElementById('staff-id').value = u ? u.user_id : '';
    document.getElementById('staff-name').value = u ? u.display_name : '';
    document.getElementById('staff-email').value = u ? u.email : '';
    document.getElementById('staff-email').disabled = !!u;
    document.getElementById('staff-phone').value = u ? '+' + u.phone : '';
    document.getElementById('staff-password').value = '';
    document.getElementById('staff-password-group').classList.toggle('hidden', !!u);
    const roleSel = document.getElementById('staff-role');
    roleSel.innerHTML = (isAdmin() ? ['admin', 'manager', 'staff'] : ['staff']).map(r => `<option value="${r}">${ROLE_LABEL[r]}</option>`).join('');
    roleSel.value = u ? u.role : 'staff';
    roleSel.disabled = !!u && !isAdmin();
    document.getElementById('staff-preset').value = '';
    document.getElementById('staff-modal-msg').innerText = '';
    renderPermGrid(u ? (u.permissions || []) : PERM_PRESETS.employee.filter(p => isAdmin() || (currentStaff.permissions || []).includes(p)));
    onStaffRoleChange();
    document.getElementById('staff-modal').classList.remove('hidden');
}
function closeStaffModal() { document.getElementById('staff-modal').classList.add('hidden'); }

async function saveStaff() {
    const id = document.getElementById('staff-id').value;
    const msg = document.getElementById('staff-modal-msg');
    const btn = document.getElementById('staff-save-btn');
    const role = document.getElementById('staff-role').value;
    const payload = {
        display_name: document.getElementById('staff-name').value.trim(),
        phone: document.getElementById('staff-phone').value.trim(),
        permissions: role === 'admin' ? [] : currentPermSelection()
    };
    if (!payload.phone) { msg.innerText = 'Phone is required.'; return; }
    btn.disabled = true; msg.innerText = '';
    let r;
    if (id) {
        r = await staffApi('update', { user_id: id, role, ...payload });
    } else {
        const email = document.getElementById('staff-email').value.trim();
        const password = document.getElementById('staff-password').value;
        if (!email) { msg.innerText = 'Email is required.'; btn.disabled = false; return; }
        if (!validNewPassword(password)) { msg.innerText = 'Password must be at least 10 characters with letters and numbers.'; btn.disabled = false; return; }
        r = await staffApi('create', { email, password, role, ...payload });
    }
    btn.disabled = false;
    if (!r.ok) { msg.innerText = r.error; return; }
    closeStaffModal();
    showToast(id ? 'Account updated.' : 'Account created.', 'success');
    renderStaffList();
}

async function toggleStaffActive(userId, active) {
    if (!(await confirmWithPassword(active ? 'Enable this account?' : 'Disable this account?'))) return;
    const r = await staffApi('update', { user_id: userId, active });
    if (!r.ok) { showToast(r.error, 'error'); return; }
    showToast(active ? 'Account enabled.' : 'Account disabled.', 'success');
    renderStaffList();
}
async function resetStaffPassword(userId) {
    const pass = await askSecret('New password', 'Enter a new password for this person (min 10 characters, letters + numbers). Tell them privately.');
    if (!pass) return;
    if (!validNewPassword(pass)) { showToast('Password must be at least 10 characters with letters and numbers.', 'error'); return; }
    const r = await staffApi('reset_password', { user_id: userId, password: pass });
    showToast(r.ok ? 'Password reset.' : r.error, r.ok ? 'success' : 'error');
}
async function unlockStaff(userId) {
    const r = await staffApi('unlock', { user_id: userId });
    showToast(r.ok ? 'Account unlocked.' : r.error, r.ok ? 'success' : 'error');
    if (r.ok) renderStaffList();
}

// ---------- activity log (Admin only; rows are written by the database, not by the browser) ----------
function describeAudit(row) {
    const d = row.detail || {};
    if (d.row) {
        const r = d.row;
        if (row.area === 'sales') return `${r.type || ''} ${r.sub_type || ''} ${r.total_display || ''}`.trim();
        if (row.area === 'loans') return `${r.name || ''} ${r.amount || ''} ${r.currency || ''} ${r.status || ''}`.trim();
        if (row.area === 'savings') return `${r.currency}: ${r.balance}`;
        if (row.area === 'settings') return `theme=${r.theme} lang=${r.lang}`;
    }
    const t = JSON.stringify(d);
    return t === '{}' ? '' : t.slice(0, 120);
}
async function loadAuditLog() {
    const body = document.getElementById('audit-table-body');
    if (!body || !isAdmin()) return;
    const { data, error } = await sb.from('smarty_audit_log').select('at,email,action,area,detail').order('at', { ascending: false }).limit(150);
    if (error) { body.innerHTML = '<tr><td colspan="5" class="no-results-msg">Could not load the log.</td></tr>'; return; }
    body.innerHTML = (data || []).length ? data.map(r => `<tr>
        <td><small>${esc(new Date(r.at).toLocaleString())}</small></td>
        <td>${esc(r.email || 'system')}</td><td><span class="status-badge">${esc(r.action)}</span></td>
        <td>${esc(r.area || '')}</td><td><small>${esc(describeAudit(r))}</small></td></tr>`).join('')
        : '<tr><td colspan="5" class="no-results-msg">No activity yet.</td></tr>';
}

// ============================================================
// APP INITIALIZATION
// ============================================================
async function initApp() {
    await loadSystemDataFromSupabase();

    if (!systemData.savings) systemData.savings = {
        USD: 0,
        SLSH: 0,
        ETB: 0
    };
    if (!systemData.loans) systemData.loans = [];
    if (!systemData.settings) systemData.settings = {
        theme: 'green',
        lang: 'so',
        profilePic: ''
    };
    if (!systemData.settings.theme) systemData.settings.theme = 'green';

    applyAllSettings();
    updateLanguageDOM();
    renderGreeting();
    calculateTotalsAndRenderTable();
    renderSavings();
    renderLoans();
    renderAllDataForSearch();
}

function renderGreeting() {
    const lang = (systemData.settings && systemData.settings.lang) || 'so';
    const hour = new Date().getHours();
    const part = hour < 12 ? 0: hour < 18 ? 1: 2;
    const words = {
        so: ['Subax wanaagsan,',
            'Galab wanaagsan,',
            'Fiid wanaagsan,'],
        en: ['Good Morning,',
            'Good Afternoon,',
            'Good Evening,']
    };
    const subs = {
        so: 'Halkan ka arag waxa ka socda lacagtaada maanta.',
        en: "Here's what's happening with your money today."
    };
    const g = document.getElementById('hero-greeting');
    const n = document.getElementById('hero-name');
    const sub = document.getElementById('hero-sub');
    if (g) g.innerText = words[lang][part];
    if (n) n.innerText = sessionStorage.getItem('system_save_role') || 'Admin';
    if (sub) sub.innerText = subs[lang];
}

function showNotifications() {
    const pending = (systemData.loans || []).filter(l => l.status === 'Pending').length;
    showToast(pending > 0
        ? `You have ${pending} pending loan${pending > 1 ? 's': ''} to follow up.`: 'No new notifications. Everything is up to date.', pending > 0 ? 'warning': 'info');
}

function toggleThemeQuick() {
    changeSystemTheme(systemData.settings.theme === 'dark' ? 'green': 'dark');
}

// ============================================================
// SUPABASE DATA LAYER
// ============================================================
async function loadSystemDataFromSupabase() {
    try {
        const [salesRes,
            loansRes,
            savingsRes,
            settingsRes] = await Promise.all([
                sb.from('sales').select('*').order('created_at', {
                    ascending: true
                }),
                sb.from('loans').select('*').order('created_at', {
                    ascending: true
                }),
                sb.from('savings').select('*'),
                sb.from('settings').select('*').eq('id', 1).maybeSingle()
            ]);

        if (salesRes.error) throw salesRes.error;
        if (loansRes.error) throw loansRes.error;
        if (savingsRes.error) throw savingsRes.error;
        if (settingsRes.error) throw settingsRes.error;

        systemData.sales = (salesRes.data || []).map(row => ({
            id: row.id,
            type: row.type,
            subType: row.sub_type,
            customer: row.customer,
            qty: row.qty,
            totalDisplay: row.total_display,
            payment: row.payment,
            date: row.date,
            cryptoProfit: row.crypto_profit
        }));

        systemData.loans = (loansRes.data || []).map(row => ({
            id: row.id,
            date: row.date,
            name: row.name,
            amount: row.amount,
            currency: row.currency,
            status: row.status
        }));

        systemData.savings = {
            USD: 0,
            SLSH: 0,
            ETB: 0
        };
        (savingsRes.data || []).forEach(row => {
            systemData.savings[row.currency] = parseFloat(row.balance) || 0;
        });

        if (settingsRes.data) {
            systemData.settings = {
                theme: settingsRes.data.theme || 'green',
                lang: settingsRes.data.lang || 'so',
                profilePic: settingsRes.data.profile_pic || ''
            };
            if (!hasPerm('settings.edit')) {
                try {
                    const lp = JSON.parse(localStorage.getItem('smarty_local_prefs') || 'null');
                    if (lp && lp.theme) systemData.settings.theme = lp.theme;
                    if (lp && lp.lang) systemData.settings.lang = lp.lang;
                } catch (_) {}
            }
        }
    } catch (err) {
        console.error("Supabase load error:", err && err.code);
        alert("Cilad ayaa dhacday marka xogta laga soo saarayo Supabase! (Load error)");
    }
}

function explainDbError(error, label) {
    console.error('Smarty database error:', label, error && error.code);
    const isDenied = error && (error.code === '42501' || /row-level security|permission denied/i.test(error.message || ''));
    showToast(isDenied ? "Ma haysatid ogolaansho (You don't have permission)."
        : `Xogta lama kaydin - hubi internetka (Could not save: ${label}).`, 'error');
    return false;
}

async function dbInsertSale(sale) {
    const { error } = await sb.from('sales').insert({
        id: sale.id, type: sale.type, sub_type: sale.subType, customer: sale.customer || null, qty: sale.qty,
        total_display: sale.totalDisplay, payment: sale.payment || null, date: sale.date || null,
        crypto_profit: sale.cryptoProfit ?? null
    });
    return error ? explainDbError(error, 'sale') : true;
}

async function dbDeleteSale(id) {
    const { data, error } = await sb.from('sales').delete().eq('id', id).select('id');
    if (error) return explainDbError(error, 'sale');
    if (!data || !data.length) return explainDbError({ code: '42501' }, 'sale');
    return true;
}

async function dbInsertLoan(loan) {
    const { error } = await sb.from('loans').insert({
        id: loan.id, date: loan.date, name: loan.name, amount: loan.amount, currency: loan.currency, status: loan.status
    });
    return error ? explainDbError(error, 'loan') : true;
}

async function dbUpdateLoanStatus(id, status) {
    const { data, error } = await sb.from('loans').update({ status }).eq('id', id).select('id');
    if (error) return explainDbError(error, 'loan');
    if (!data || !data.length) return explainDbError({ code: '42501' }, 'loan');
    return true;
}

async function dbDeleteLoan(id) {
    const { data, error } = await sb.from('loans').delete().eq('id', id).select('id');
    if (error) return explainDbError(error, 'loan');
    if (!data || !data.length) return explainDbError({ code: '42501' }, 'loan');
    return true;
}

async function dbUpdateSavings(currency, balance) {
    const { error } = await sb.from('savings').upsert({ currency, balance, updated_at: new Date().toISOString() });
    return error ? explainDbError(error, 'savings') : true;
}

async function dbUpdateSettings() {
    // People without "change shared settings" keep their theme/language on this device only.
    if (!hasPerm('settings.edit')) {
        localStorage.setItem('smarty_local_prefs', JSON.stringify({ theme: systemData.settings.theme, lang: systemData.settings.lang }));
        return true;
    }
    const { error } = await sb.from('settings').upsert({
        id: 1, theme: systemData.settings.theme, lang: systemData.settings.lang,
        profile_pic: systemData.settings.profilePic, updated_at: new Date().toISOString()
    });
    return error ? explainDbError(error, 'settings') : true;
}

// Import / reset run inside ONE database transaction (admin only): all-or-nothing.
async function dbImportAllData(data) {
    const { error } = await sb.rpc('smarty_import', { p: data });
    return error ? explainDbError(error, 'import') : true;
}

async function dbClearAllData() {
    const { error } = await sb.rpc('smarty_reset');
    return error ? explainDbError(error, 'reset') : true;
}

// ============================================================
// THEME MANAGEMENT
// ============================================================
function changeSystemTheme(themeName) {
    showLoading("Changing system theme...", 600, () => {
        systemData.settings.theme = themeName;
        saveData();
        applyThemeDOM(themeName);
    });
}

function applyThemeDOM(themeName) {
    const root = document.getElementById('system-root-html');
    if (!root) return;

    root.classList.remove('theme-green', 'theme-light', 'theme-dark');
    if (!['green', 'dark'].includes(themeName)) themeName = 'green';
    root.classList.add(`theme-${themeName}`);

    const themeIcon = document.getElementById('theme-toggle-icon');
    if (themeIcon) themeIcon.className = themeName === 'dark' ? 'ph-bold ph-sun': 'ph-bold ph-moon';

    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`theme-btn-${themeName}`);
    if (activeBtn) activeBtn.classList.add('active');
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================
function renderAllDataForSearch() {
    calculateTotalsAndRenderTable();
    renderLoans();
    renderSavingsTable();
}

function renderSavingsTable() {
    const tbody = document.getElementById('group-savings-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const currencies = [{
        key: 'USD',
        label: 'USD ($)',
        value: systemData.savings.USD
    },
        {
            key: 'SLSH',
            label: 'SLSH (Sh)',
            value: systemData.savings.SLSH
        },
        {
            key: 'ETB',
            label: 'ETB (Br)',
            value: systemData.savings.ETB
        }];

    currencies.forEach(c => {
        const tr = document.createElement('tr');
        const displayValue = c.key === 'USD' ? `$${c.value.toFixed(2)}`:
        c.key === 'SLSH' ? `${Math.round(c.value).toLocaleString()} Sh`:
        `${c.value.toFixed(2)} Br`;
        tr.innerHTML = `
        <td><strong>${c.label}</strong></td>
        <td>${displayValue}</td>
        <td>${new Date().toLocaleDateString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAvatar(base64) {
    const imgD = document.getElementById('avatar-preview');
    const placeholderD = document.getElementById('avatar-placeholder');
    const imgTop = document.getElementById('avatar-preview-top');
    const placeholderTop = document.getElementById('avatar-placeholder-top');

    if (base64 && base64.trim() !== "") {
        if (imgD) {
            imgD.src = base64; imgD.classList.remove('hidden');
        }
        if (placeholderD) placeholderD.classList.add('hidden');
        if (imgTop) {
            imgTop.src = base64; imgTop.classList.remove('hidden');
        }
        if (placeholderTop) placeholderTop.classList.add('hidden');
    } else {
        if (imgD) {
            imgD.src = ""; imgD.classList.add('hidden');
        }
        if (placeholderD) placeholderD.classList.remove('hidden');
        if (imgTop) {
            imgTop.src = ""; imgTop.classList.add('hidden');
        }
        if (placeholderTop) placeholderTop.classList.remove('hidden');
    }
}

function triggerAvatarUpload() {
    document.getElementById('sidebar-avatar-input').click();
}

function handleAvatarFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            systemData.settings.profilePic = e.target.result;
            saveData();
            renderAvatar(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function calculateTotalsAndRenderTable() {
    let cryptoTotal = 0,
    poultryCount = 0,
    livestockCount = 0;

    const pTb = document.getElementById('group-poultry-tbody');
    const lTb = document.getElementById('group-livestock-tbody');
    const cTb = document.getElementById('group-crypto-tbody');

    if (pTb) pTb.innerHTML = '';
    if (lTb) lTb.innerHTML = '';
    if (cTb) cTb.innerHTML = '';

    systemData.sales.forEach(sale => {
        const tr = document.createElement('tr');

        if (sale.type === 'POULTRY') {
            poultryCount++;
            tr.innerHTML = `
            <td><strong>${sale.customer}</strong></td>
            <td><span class="status-badge">${sale.subType}</span></td>
            <td>${sale.qty}</td>
            <td class="text-green-premium">${sale.totalDisplay}</td>
            <td><small><i class="ph-fill ph-wallet"></i> ${sale.payment}</small></td>
            <td><button onclick="deleteSale(${sale.id})" style="color:#dc2626; background:none; border:none; padding:4px 8px; cursor:pointer;"><i class="ph-bold ph-trash"></i></button></td>
            `;
            if (pTb) pTb.appendChild(tr);
        } else if (sale.type === 'LIVESTOCK') {
            livestockCount += sale.qty;
            tr.innerHTML = `
            <td><span class="status-badge">${sale.subType}</span></td>
            <td><strong>${sale.qty}</strong></td>
            <td class="text-green-premium">${sale.totalDisplay}</td>
            <td><small><i class="ph-fill ph-wallet"></i> ${sale.payment}</small></td>
            <td><small>${sale.date}</small></td>
            <td><button onclick="deleteSale(${sale.id})" style="color:#dc2626; background:none; border:none; padding:4px 8px; cursor:pointer;"><i class="ph-bold ph-trash"></i></button></td>
            `;
            if (lTb) lTb.appendChild(tr);
        } else if (sale.type === 'CRYPTO') {
            cryptoTotal += sale.cryptoProfit || 0;
            tr.innerHTML = `
            <td><span class="status-badge">${sale.subType}</span></td>
            <td>${sale.qty}</td>
            <td><small>${sale.customer}</small></td>
            <td><small>${sale.totalDisplay}</small></td>
            <td class="text-green-premium">$${(sale.cryptoProfit || 0).toFixed(2)}</td>
            <td><button onclick="deleteSale(${sale.id})" style="color:#dc2626; background:none; border:none; padding:4px 8px; cursor:pointer;"><i class="ph-bold ph-trash"></i></button></td>
            `;
            if (cTb) cTb.appendChild(tr);
        }
    });

    if (document.getElementById('dash-poultry-count')) {
        document.getElementById('dash-poultry-count').innerText = `${poultryCount} Trans`;
    }
    if (document.getElementById('dash-livestock-count')) {
        document.getElementById('dash-livestock-count').innerText = `${livestockCount} Heads`;
    }
    if (document.getElementById('dash-crypto-profit')) {
        document.getElementById('dash-crypto-profit').innerText = `$${cryptoTotal.toFixed(2)}`;
    }

    const dashSearch = document.getElementById('dashboard-search');
    if (dashSearch && dashSearch.value !== "") {
        searchAllSystemData();
    }
    renderDashboardCharts();
}

function updateLoanIndicators() {
    const pending = (systemData.loans || []).filter(l => l.status === 'Pending').length;
    const card = document.getElementById('dash-loans-count');
    if (card) card.innerText = `${pending} Open`;
    const dot = document.getElementById('notif-dot');
    if (dot) dot.classList.toggle('hidden', pending === 0);
}

function renderLoans() {
    updateLoanIndicators();
    const tbody = document.getElementById('loan-table-body');
    const dashTbody = document.getElementById('group-loans-tbody');

    if (tbody) tbody.innerHTML = '';
    if (dashTbody) dashTbody.innerHTML = '';

    systemData.loans.forEach(loan => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${loan.date}</td>
        <td>${loan.name}</td>
        <td>${loan.amount} ${loan.currency}</td>
        <td><span class="status-badge ${loan.status === 'Pending' ? 'status-pending': ''}">${loan.status}</span></td>
        <td>
        <button onclick="refundLoan(${loan.id})" class="btn btn-sm"><i class="ph-bold ph-check"></i> Refund</button>
        <button onclick="deleteLoan(${loan.id})" style="margin-left:8px; color:#dc2626; background:none; border:none; padding:4px 6px; cursor:pointer;"><i class="ph-bold ph-trash"></i></button>
        </td>
        `;
        if (tbody) tbody.appendChild(tr);

        if (dashTbody) {
            const dashTr = document.createElement('tr');
            dashTr.innerHTML = `
            <td>${loan.date}</td>
            <td>${loan.name}</td>
            <td>${loan.amount} ${loan.currency}</td>
            <td>${loan.currency}</td>
            <td><span class="status-badge ${loan.status === 'Pending' ? 'status-pending': ''}">${loan.status}</span></td>
            <td>
            <button onclick="refundLoan(${loan.id})" class="btn btn-sm"><i class="ph-bold ph-check"></i> Refund</button>
            <button onclick="deleteLoan(${loan.id})" style="margin-left:8px; color:#dc2626; background:none; border:none; padding:4px 6px; cursor:pointer;"><i class="ph-bold ph-trash"></i></button>
            </td>
            `;
            dashTbody.appendChild(dashTr);
        }
    });
}

function renderSavings() {
    if (document.getElementById('wallet-usd')) {
        document.getElementById('wallet-usd').innerText = `$${systemData.savings.USD.toFixed(2)}`;
    }
    if (document.getElementById('wallet-slsh')) {
        document.getElementById('wallet-slsh').innerText = `SLS${Math.round(systemData.savings.SLSH).toLocaleString()}`;
    }
    if (document.getElementById('wallet-etb')) {
        document.getElementById('wallet-etb').innerText = `ETB${systemData.savings.ETB.toFixed(2)}`;
    }
}

// ============================================================
// DELETE & PERMISSION
// ============================================================
async function deleteSale(id) {
    const sale = systemData.sales.find(x => x.id === id);
    if (!sale) return;
    if (!hasPerm(String(sale.type).toLowerCase() + '.delete')) { denied(); return; }
    if (!(await confirmWithPassword('Enter your password to confirm deletion.'))) return;
    showLoading("Deleting item...", 800, async () => {
        const ok = await dbDeleteSale(id);
        if (ok) systemData.sales = systemData.sales.filter(item => item.id !== id);
        calculateTotalsAndRenderTable();
        renderAllDataForSearch();
    });
}

async function deleteLoan(id) {
    if (!hasPerm('loans.delete')) { denied(); return; }
    if (!(await confirmWithPassword('Enter your password to confirm deletion.'))) return;
    showLoading("Deleting loan...", 800, async () => {
        const ok = await dbDeleteLoan(id);
        if (ok) systemData.loans = systemData.loans.filter(l => l.id !== id);
        renderLoans();
        renderAllDataForSearch();
    });
}

// ============================================================
// SAVE FUNCTIONS
// ============================================================
function saveAndGenerateReceipt() {
    if (!hasPerm('poultry.add')) { denied(); return; }
    const customer = document.getElementById('poultry-customer').value.trim();
    const item = document.getElementById('poultry-item').value;
    const qty = parseInt(document.getElementById('poultry-qty').value) || 0;
    const price = parseFloat(document.getElementById('poultry-price').value) || 0;
    const currency = document.getElementById('poultry-currency').value;
    const payment = document.getElementById('poultry-payment').value;
    const date = document.getElementById('poultry-date').value;

    if (!customer || qty <= 0 || price <= 0 || !date) {
        alert("Please fill in all details!");
        return;
    }

    const total = qty * price;

    showLoading("Saving Poultry Sale...", 900, async () => {
        const newSale = {
            id: Date.now(),
            type: 'POULTRY',
            subType: item,
            customer: customer,
            qty: qty,
            totalDisplay: `${total} ${currency}`,
            payment: payment,
            date: date
        };
        if (!(await dbInsertSale(newSale))) return;
        systemData.sales.push(newSale);
        calculateTotalsAndRenderTable();
        renderAllDataForSearch();

        document.getElementById('rec-customer').innerText = customer;
        document.getElementById('rec-item').innerText = item;
        document.getElementById('rec-qty').innerText = qty;
        document.getElementById('rec-price').innerText = `${price} ${currency}`;
        document.getElementById('rec-payment').innerText = payment;
        document.getElementById('rec-date').innerText = date;
        document.getElementById('rec-total').innerText = `${total} ${currency}`;

        window.print();
        switchTab('dashboard');
    });
}

function saveLivestock() {
    if (!hasPerm('livestock.add')) { denied(); return; }
    const type = document.getElementById('live-type').value;
    const qty = parseInt(document.getElementById('live-qty').value) || 0;
    const price = parseFloat(document.getElementById('live-price').value) || 0;
    const currency = document.getElementById('live-currency').value;
    const payment = document.getElementById('live-payment').value;
    const date = document.getElementById('live-date').value;

    if (qty <= 0 || price <= 0 || !date) {
        alert("Please fill all details!");
        return;
    }

    const total = qty * price;
    let formattedTotal = `${total} ${currency}`;

    showLoading("Saving Livestock Entry...", 800, async () => {
        const newSale = {
            id: Date.now(),
            type: 'LIVESTOCK',
            subType: type,
            qty: qty,
            totalDisplay: formattedTotal,
            payment: payment,
            date: date
        };
        if (!(await dbInsertSale(newSale))) return;
        systemData.sales.push(newSale);
        calculateTotalsAndRenderTable();
        renderAllDataForSearch();
        switchTab('dashboard');
    });
}

function saveCryptoTrade() {
    if (!hasPerm('crypto.add')) { denied(); return; }
    const type = document.getElementById('crypto-type').value;
    const qty = parseFloat(document.getElementById('crypto-qty').value) || 0;
    const buyPrice = parseFloat(document.getElementById('crypto-buy-price').value) || 0;
    const sellPrice = parseFloat(document.getElementById('crypto-sell-price').value) || 0;

    if (qty <= 0 || buyPrice <= 0 || sellPrice <= 0) {
        alert("Please enter valid prices!");
        return;
    }

    const initialCapital = qty * buyPrice;
    const finalCapital = qty * sellPrice;

    showLoading("Adding crypto trading...", 800, async () => {
        const newSale = {
            id: Date.now(),
            type: 'CRYPTO',
            subType: type,
            qty: qty,
            customer: `Buy: $${buyPrice} | Sell: $${sellPrice}`,
            totalDisplay: `$${initialCapital.toFixed(1)} -> $${finalCapital.toFixed(1)}`,
            cryptoProfit: finalCapital - initialCapital
        };
        if (!(await dbInsertSale(newSale))) return;
        systemData.sales.push(newSale);
        calculateTotalsAndRenderTable();
        renderAllDataForSearch();
        switchTab('dashboard');
    });
}

// ============================================================
// TAB NAVIGATION
// ============================================================
function switchTabSecure(tabId) {
    if (!canOpenTab(tabId)) { denied(); return; }
    showLoading("Loading...", 500, () => {
        switchTab(tabId);
    });
}

function switchTab(tabId) {
    if (currentStaff && !canOpenTab(tabId)) { denied(); return; }
    activeTab = tabId;
    if (tabId === 'settings' && currentStaff) onSettingsOpen();

    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.remove('hidden');

    updatePageTitle();

    const appScreen = document.getElementById('app-screen');
    if (appScreen) appScreen.dataset.tab = tabId;
    document.querySelectorAll('[data-tab]').forEach(btn => {
        if (btn.tagName === 'BUTTON') btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if (isMobileMenuOpen) toggleMobileMenu();
}

function initClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    const update = () => {
        clockEl.innerHTML = `<i class="ph ph-clock"></i> ${new Date().toLocaleString()}`;
        const topClock = document.querySelector('#topbar-clock span');
        if (topClock) topClock.textContent = new Date().toLocaleString();
    };
    update();
    setInterval(update, 1000);
}

function updatePageTitle() {
    const currentLang = systemData.settings.lang || 'so';
    const titles = {
        dashboard: languages[currentLang].titleDashboard,
        'save-money': languages[currentLang].titleSave,
        loan: languages[currentLang].titleLoan,
        exchange: languages[currentLang].titleExchange,
        settings: languages[currentLang].titleSettings
    };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        const icons = {
            dashboard: 'ph-chart-line-up',
            poultry: 'ph-egg',
            livestock: 'ph-cow',
            crypto: 'ph-currency-btc',
            'save-money': 'ph-piggy-bank',
            loan: 'ph-hand-coins',
            exchange: 'ph-arrows-left-right',
            settings: 'ph-gear'
        };
        titles.poultry = 'Poultry Business';
        titles.livestock = 'Livestock Management';
        titles.crypto = 'Crypto Trade';
        pageTitle.innerHTML = `<i class="ph-fill ${icons[activeTab] || 'ph-chart-line-up'}"></i> ${titles[activeTab] || "Poultry & Livestock"}`;
    }
}

// ============================================================
// LANGUAGE
// ============================================================
function changeLanguage(lang) {
    showLoading("Changing language...", 800, () => {
        systemData.settings.lang = lang;
        saveData();
        updateLanguageDOM();
        renderGreeting();
        updatePageTitle();
        calculateTotalsAndRenderTable();
        renderLoans();
        translateStaticUI();
    });
}

function updateLanguageDOM() {
    const l = languages[systemData.settings.lang || 'so'];
    const subTitle = document.getElementById('lang-sub-title');
    const menuDashboard = document.getElementById('menu-dashboard');
    const menuSave = document.getElementById('menu-save');
    const menuLoan = document.getElementById('menu-loan');
    const menuExchange = document.getElementById('menu-exchange');
    const menuSettings = document.getElementById('menu-settings');
    const menuLogout = document.getElementById('menu-logout');

    if (subTitle) subTitle.innerText = l.subTitle;
    if (menuDashboard) menuDashboard.innerText = l.menuDashboard;
    if (menuSave) menuSave.innerText = l.menuSave;
    if (menuLoan) menuLoan.innerText = l.menuLoan;
    if (menuExchange) menuExchange.innerText = l.menuExchange;
    if (menuSettings) menuSettings.innerText = l.menuSettings;
    if (menuLogout) menuLogout.innerText = l.menuLogout;
}

// ============================================================
// SAVINGS
// ============================================================
function adjustSavedMoney(action) {
    if (!hasPerm('savings.update')) { denied(); return; }
    const amount = parseFloat(document.getElementById('save-amount').value) || 0;
    const currency = document.getElementById('save-currency').value;
    if (amount <= 0) return;

    showLoading("Updating savings...", 700, async () => {
        const current = systemData.savings[currency] || 0;
        let next = current;
        if (action === 'add') next = current + amount;
        else if (action === 'sub' && current >= amount) next = current - amount;
        else { showToast('Not enough savings for this withdrawal.', 'error'); return; }
        if (!(await dbUpdateSavings(currency, next))) return;
        systemData.savings[currency] = next;
        renderSavings();
        renderSavingsTable();
        renderAllDataForSearch();
    });
}

// ============================================================
// LOANS
// ============================================================
function addLoan() {
    if (!hasPerm('loans.add')) { denied(); return; }
    const name = document.getElementById('loan-name').value.trim();
    const amount = parseFloat(document.getElementById('loan-amount').value) || 0;
    const currency = document.getElementById('loan-currency').value;
    if (!name || amount <= 0) return;

    showLoading("Adding loan details...", 700, async () => {
        const newLoan = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            name: name,
            amount: amount,
            currency: currency,
            status: 'Pending'
        };
        if (!(await dbInsertLoan(newLoan))) return;
        systemData.loans.push(newLoan);
        renderLoans();
        renderAllDataForSearch();
    });
}

function refundLoan(id) {
    if (!hasPerm('loans.update')) { denied(); return; }
    showLoading("Updating loan status...", 900, async () => {
        const loan = systemData.loans.find(l => l.id === id);
        if (!loan) return;
        if (!(await dbUpdateLoanStatus(loan.id, 'Refunded'))) return;
        loan.status = 'Refunded';
        renderLoans();
        renderAllDataForSearch();
    });
}

// ============================================================
// EXCHANGE
// ============================================================
function convertCurrency() {
    const amount = parseFloat(document.getElementById('ex-amount').value) || 0;
    const from = document.getElementById('ex-from').value;
    const rateSLSH = parseFloat(document.getElementById('rate-slsh').value) || 11100;
    const rateETB = parseFloat(document.getElementById('rate-etb').value) || 190;
    if (amount <= 0) return;

    let usd = from === 'USD' ? amount:
    (from === 'SLSH' ? amount / rateSLSH: amount / rateETB);

    document.getElementById('exchange-output').innerHTML = `
    <strong>${amount} ${from} =</strong><br>
    USD $${usd.toFixed(2)}<br>
    SLS ${Math.round(usd * rateSLSH).toLocaleString()}<br>
    ETB ${(usd * rateETB).toFixed(2)}
    `;
    document.getElementById('exchange-result').classList.remove('hidden');
}

// ============================================================
// SETTINGS
// ============================================================
function applyAllSettings() {
    applyThemeDOM(systemData.settings.theme || 'green');
    renderAvatar(systemData.settings.profilePic);
}

function saveData() {
    dbUpdateSettings();
}


// ============================================================
// PDF REPORT (Settings -> PDF Report)
// ============================================================
function reportRange(period) {
    const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const now = new Date();
    const today = ymd(now);
    if (period === 'month') {
        return {
            from: ymd(new Date(now.getFullYear(), now.getMonth(), 1)),
            to: today,
            label: 'This month (' + now.toLocaleString('en-US', {
                month: 'long', year: 'numeric'
            }) + ')'
        };
    }
    if (period === '30') {
        const d = new Date(now); d.setDate(d.getDate() - 29);
        return {
            from: ymd(d),
            to: today,
            label: 'Last 30 days'
        };
    }
    if (period === 'year') return {
        from: now.getFullYear() + '-01-01',
        to: today,
        label: 'This year (' + now.getFullYear() + ')'
    };
    return {
        from: '0000-01-01',
        to: '9999-12-31',
        label: 'All time'
    };
}

// Records keep either a YYYY-MM-DD date or a timestamp id (Date.now()). Returns YYYY-MM-DD or ''.
function recordDay(rec) {
    if (rec.date && /^\d{4}-\d{2}-\d{2}$/.test(rec.date)) return rec.date;
    if (typeof rec.id === 'number' && rec.id > 1e12) {
        const d = new Date(rec.id);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    return '';
}

function downloadReportPdf() {
    const JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) {
        showToast('PDF tool could not load. Check your internet and try again.', 'error'); return;
    }
    try {
        const range = reportRange(document.getElementById('report-period').value);
        const inRange = rec => {
            const d = recordDay(rec); return !d || (d >= range.from && d <= range.to);
        };

        const sales = (systemData.sales || []).filter(inRange);
        const poultry = sales.filter(x => x.type === 'POULTRY');
        const livestock = sales.filter(x => x.type === 'LIVESTOCK');
        const crypto = sales.filter(x => x.type === 'CRYPTO');
        const loans = (systemData.loans || []).filter(inRange);
        const sv = systemData.savings || {
            USD: 0,
            SLSH: 0,
            ETB: 0
        };
        const cryptoProfit = crypto.reduce((a, x) => a + (x.cryptoProfit || 0), 0);
        const livestockHeads = livestock.reduce((a, x) => a + (Number(x.qty) || 0), 0);
        const pendingLoans = loans.filter(l => l.status === 'Pending').length;

        const doc = new JsPDF( {
            unit: 'pt', format: 'a4'
        });
        const W = doc.internal.pageSize.getWidth();
        const H = doc.internal.pageSize.getHeight();
        const M = 40;
        const GREEN = [12,
            196,
            78];
        const NAVY = [7,
            27,
            47];
        const INK = [16,
            37,
            58];
        const MUTED = [106,
            125,
            144];
        const now = new Date();
        const role = sessionStorage.getItem('system_save_role') || '';

        // Header band
        doc.setFillColor(...NAVY);
        doc.rect(0, 0, W, 96, 'F');
        doc.setFillColor(...GREEN);
        doc.rect(0, 96, W, 4, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text('SMARTY SYSTEM', M, 44);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text('Business Report', M, 64);
        doc.setFontSize(10);
        doc.text(range.label, W - M, 44, {
            align: 'right'
        });
        doc.text('Generated ' + now.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        }), W - M, 62, {
            align: 'right'
        });
        if (role) doc.text('Prepared by: ' + role, W - M, 78, {
            align: 'right'
        });

        let y = 128;
        const heading = (text) => {
            if (y > H - 140) {
                doc.addPage(); y = 50;
            }
            doc.setTextColor(...INK);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.text(text, M, y);
            y += 10;
        };
        const note = (text) => {
            doc.setTextColor(...MUTED);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(text, M, y + 12);
            y += 36;
        };
        const table = (head, body, opts = {}) => {
            if (!body.length) return note(opts.empty || 'No data.');
            doc.autoTable({
                startY: y,
                head: [head],
                body,
                margin: {
                    left: M, right: M
                },
                theme: 'striped',
                styles: {
                    font: 'helvetica', fontSize: 9, cellPadding: 6, textColor: INK, overflow: 'linebreak'
                },
                headStyles: {
                    fillColor: NAVY, textColor: 255, fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [240, 248, 243]
                },
                columnStyles: opts.columnStyles || {}
            });
            y = doc.lastAutoTable.finalY + 26;
        };

        // 1. Summary
        heading('Summary');
        table(['Poultry sales', 'Livestock heads', 'Crypto profit', 'Pending loans'], [[
            String(poultry.length), String(livestockHeads), '$' + cryptoProfit.toFixed(2), String(pendingLoans)
        ]]);

        // 2. Savings
        heading('Savings balances (today)');
        table(['Currency', 'Balance'], [
            ['USD ($)', '$' + Number(sv.USD || 0).toFixed(2)],
            ['SLSH (Sh)', Math.round(sv.SLSH || 0).toLocaleString() + ' Sh'],
            ['ETB (Br)', Number(sv.ETB || 0).toFixed(2) + ' Br']
        ], {
            columnStyles: {
                1: {
                    halign: 'right'
                }
            }
        });

        // 3. Poultry
        heading('Poultry business (' + poultry.length + ')');
        table(['Date', 'Customer', 'Item', 'Qty', 'Total', 'Payment'],
            poultry.map(x => [recordDay(x) || '-', x.customer || '-', x.subType || '-', x.qty, x.totalDisplay || '-', x.payment || '-']),
            {
                columnStyles: {
                    3: {
                        halign: 'right'
                    }, 4: {
                        halign: 'right'
                    }
                }, empty: 'No poultry sales in this period.'
            });

        // 4. Livestock
        heading('Livestock (' + livestock.length + ')');
        table(['Date', 'Animal', 'Qty', 'Total value', 'Payment'],
            livestock.map(x => [recordDay(x) || '-', x.subType || '-', x.qty, x.totalDisplay || '-', x.payment || '-']),
            {
                columnStyles: {
                    2: {
                        halign: 'right'
                    }, 3: {
                        halign: 'right'
                    }
                }, empty: 'No livestock entries in this period.'
            });

        // 5. Crypto
        heading('Crypto trades (' + crypto.length + ')');
        table(['Date', 'Coin', 'Qty', 'Prices', 'Capital flow', 'Net profit'],
            crypto.map(x => [recordDay(x) || '-', x.subType || '-', x.qty, x.customer || '-', x.totalDisplay || '-', '$' + (x.cryptoProfit || 0).toFixed(2)]),
            {
                columnStyles: {
                    2: {
                        halign: 'right'
                    }, 5: {
                        halign: 'right'
                    }
                }, empty: 'No crypto trades in this period.'
            });

        // 6. Loans
        heading('Loans (' + loans.length + ')');
        table(['Date', 'Name', 'Amount', 'Currency', 'Status'],
            loans.map(l => [l.date || recordDay(l) || '-', l.name || '-', l.amount, l.currency || '-', l.status || '-']),
            {
                columnStyles: {
                    2: {
                        halign: 'right'
                    }
                }, empty: 'No loans in this period.'
            });

        // Footer on every page
        const pages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pages; i++) {
            doc.setPage(i);
            doc.setDrawColor(223, 232, 239);
            doc.line(M, H - 34, W - M, H - 34);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...MUTED);
            doc.text('Smarty System - Smart Plan, Better Future', M, H - 20);
            doc.text('Page ' + i + ' of ' + pages, W - M, H - 20, {
                align: 'right'
            });
        }

        const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        doc.save(`Smarty-report-${stamp}.pdf`);
        showToast('PDF report downloaded.', 'success');
    } catch (err) {
        console.error('Smarty PDF error:', err);
        showToast('Could not create the PDF: ' + (err.message || 'unknown error'), 'error');
    }
}

// ============================================================
// MOBILE MENU
// ============================================================
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('sidebar-overlay');
    const menuIcon = document.getElementById('menu-icon');

    isMobileMenuOpen = !isMobileMenuOpen;

    if (sidebar) sidebar.className = isMobileMenuOpen ? "active": "";
    if (overlay) overlay.className = isMobileMenuOpen ? "active": "";
    if (menuIcon) menuIcon.className = isMobileMenuOpen ? "ph-bold ph-x": "ph-bold ph-list";

    document.body.style.overflow = isMobileMenuOpen ? 'hidden': '';
}

// ============================================================
// DATA EXPORT/IMPORT
// ============================================================
function exportData() {
    if (!hasPerm('data.export')) { denied(); return; }
    const data = JSON.stringify(systemData, null, 2);
    const blob = new Blob([data], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_save_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data exported successfully!", "success");
}

function importData(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    if (!isAdmin()) { denied(); return; }

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!(importedData.sales && importedData.savings && importedData.loans)) {
                showToast("Invalid JSON data format!", "error");
                return;
            }
            if (!(await confirmWithPassword('Importing REPLACES current sales and loans. Enter your password to continue.'))) return;
            showLoading("Importing data...", 800, async () => {
                const ok = await dbImportAllData(importedData);   // atomic: nothing changes if it fails
                await loadSystemDataFromSupabase();               // always show what the database really holds
                applyAllSettings();
                updateLanguageDOM();
                calculateTotalsAndRenderTable();
                renderSavings();
                renderLoans();
                renderAllDataForSearch();
                if (ok) showToast("Data imported successfully!", "success");
            });
        } catch (err) {
            showToast("Error importing file!", "error");
        }
    };
    reader.readAsText(file);
}

async function restoreSystemSecure() {
    if (!isAdmin()) { denied(); return; }
    if (!confirm("Are you sure you want to reset the system? All sales, loans and savings will be cleared.")) return;
    if (!(await confirmWithPassword('Enter your password to reset the system.'))) return;
    showLoading("Restoring system...", 1000, async () => {
        const ok = await dbClearAllData();   // atomic, admin only
        await loadSystemDataFromSupabase();
        applyAllSettings();
        updateLanguageDOM();
        calculateTotalsAndRenderTable();
        renderSavings();
        renderLoans();
        renderAllDataForSearch();
        if (ok) showToast("System restored successfully!", "success");
    });
}
