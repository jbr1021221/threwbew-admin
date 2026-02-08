// =====================================================
// ADMIN DASHBOARD - JAVASCRIPT
// =====================================================

// Firebase Configuration is loaded from firebase-config.js

// Admin Credentials (hashed for security)
// Default password is "admin123" - hashed using SHA-256
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'; // SHA-256 hash of "admin123"
// Monitored IP addresses (Shown separately)
const MONITORED_IPS = ['37.111.193.184', '27.147.182.17'];
// Other excluded IP addresses (Hidden from dashboard)
const OTHER_EXCLUDED_IPS = ['37.111.193.252'];

// Global Variables
let db = null;
let visitorsData = [];
let monitoredIpVisits = []; // Separate array for monitored IP visits
let charts = {};

// Pagination & Search State
let filteredVisitors = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 15;

// =====================================================
// PASSWORD HASHING UTILITY
// =====================================================

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// =====================================================
// AUTHENTICATION
// =====================================================

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    const storedUsername = localStorage.getItem('adminUsername') || DEFAULT_USERNAME;
    const storedPasswordHash = localStorage.getItem('adminPasswordHash') || DEFAULT_PASSWORD_HASH;

    // Hash the entered password
    const enteredPasswordHash = await hashPassword(password);

    if (username === storedUsername && enteredPasswordHash === storedPasswordHash) {
        // Login successful
        // Store authentication state in sessionStorage (persists during browser session)
        sessionStorage.setItem('adminAuthenticated', 'true');

        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardScreen').style.display = 'flex';

        // Initialize Firebase and load data
        initializeFirebase();
    } else {
        // Show error
        document.getElementById('loginError').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('loginError').style.display = 'none';
        }, 3000);
    }
});

// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('adminPassword');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', function () {
    // Clear authentication state
    sessionStorage.removeItem('adminAuthenticated');

    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loginForm').reset();
});

// =====================================================
// FIREBASE INITIALIZATION
// =====================================================

async function initializeFirebase() {
    try {
        console.log("Initializing Firebase...");

        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        const firestore = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

        const app = initializeApp(firebaseConfig);
        db = firestore.getFirestore(app);

        console.log("Firebase initialized successfully!");

        // Subscribe to real-time updates
        subscribeToVisitors(firestore);

    } catch (error) {
        console.error("Firebase initialization failed:", error);
        alert("Failed to connect to database. Please check your internet connection.");
    }
}

function subscribeToVisitors(firestore) {
    const q = firestore.query(
        firestore.collection(db, "visitors"),
        firestore.orderBy("timestamp", "desc")
    );

    firestore.onSnapshot(q, (querySnapshot) => {
        visitorsData = [];
        monitoredIpVisits = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Separate monitored IPs
            if (MONITORED_IPS.includes(data.ip)) {
                monitoredIpVisits.push({ id: doc.id, ...data });
            }
            // Filter out all excluded IPs (monitored + other excluded)
            else if (!OTHER_EXCLUDED_IPS.includes(data.ip)) {
                visitorsData.push({ id: doc.id, ...data });
            }
        });

        console.log(`Loaded ${visitorsData.length} visitors`);
        console.log(`Loaded ${monitoredIpVisits.length} monitored IP visits`);

        // Initialize filtered list with all data initially
        filteredVisitors = [...visitorsData];

        // Reset to page 1 on new data arrival (optional, but good for real-time)
        // currentPage = 1; 

        // Update all views
        updateOverviewStats();
        updateVisitorsTable();
        updateAnalytics();
        updateDeviceVisitsTable(); // Add this call
        updateMonitoredIpTable(); // Add this call for monitored IPs
        updateCharts();
    }, (error) => {
        console.error("Error fetching visitors:", error);
    });
}

// =====================================================
// NAVIGATION
// =====================================================

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        // Update view
        const view = this.dataset.view;
        document.querySelectorAll('.view-content').forEach(content => content.classList.remove('active'));
        document.getElementById(view + 'View').classList.add('active');

        // Update header
        const titles = {
            'overview': { title: 'Overview', subtitle: 'Real-time visitor analytics and insights' },
            'visitors': { title: 'All Visitors', subtitle: 'Complete visitor log with details' },
            'analytics': { title: 'Analytics', subtitle: 'Deep dive into visitor behavior' }
        };

        document.getElementById('pageTitle').textContent = titles[view].title;
        document.getElementById('pageSubtitle').textContent = titles[view].subtitle;
    });
});

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', function () {
    this.classList.add('spinning');

    // Refresh data
    updateOverviewStats();
    updateVisitorsTable();
    updateAnalytics();
    updateDeviceVisitsTable(); // Add this call
    updateMonitoredIpTable(); // Add this call for monitored IPs
    updateCharts();

    setTimeout(() => {
        this.classList.remove('spinning');
    }, 1000);
});

// =====================================================
// OVERVIEW STATS
// =====================================================

function updateOverviewStats() {
    if (visitorsData.length === 0) return;

    // Total visitors
    document.getElementById('totalVisitors').textContent = visitorsData.length.toLocaleString();

    // Calculate growth (last 24h vs previous 24h)
    const now = new Date();
    const last24h = visitorsData.filter(v => {
        const visitTime = new Date(v.timestamp);
        return (now - visitTime) < 24 * 60 * 60 * 1000;
    }).length;

    const previous24h = visitorsData.filter(v => {
        const visitTime = new Date(v.timestamp);
        const diff = now - visitTime;
        return diff >= 24 * 60 * 60 * 1000 && diff < 48 * 60 * 60 * 1000;
    }).length;

    const growth = previous24h > 0 ? ((last24h - previous24h) / previous24h * 100).toFixed(1) : 0;
    document.getElementById('visitorGrowth').textContent = `${growth > 0 ? '+' : ''}${growth}%`;

    // Unique countries
    const countries = new Set(visitorsData.map(v => v.location?.country).filter(c => c && c !== 'Unknown'));
    document.getElementById('totalCountries').textContent = countries.size;

    // Device breakdown
    const devices = visitorsData.reduce((acc, v) => {
        const type = v.device?.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    document.getElementById('desktopUsers').textContent = (devices.Desktop || 0).toLocaleString();
    document.getElementById('mobileUsers').textContent = (devices.Mobile || 0).toLocaleString();

    // Update top locations table
    updateTopLocationsTable();
}

function updateTopLocationsTable() {
    const locationCounts = visitorsData.reduce((acc, v) => {
        const country = v.location?.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});

    const sortedLocations = Object.entries(locationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const total = visitorsData.length;
    const tbody = document.getElementById('topLocationsTable');

    if (sortedLocations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading-cell">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = sortedLocations.map(([country, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        return `
            <tr>
                <td><strong>${country}</strong></td>
                <td>${count.toLocaleString()}</td>
                <td>${percentage}%</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill-bar" style="width: ${percentage}%"></div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// =====================================================
// VISITORS TABLE
// =====================================================

function updateVisitorsTable() {
    const tbody = document.getElementById('visitorsTable');
    const paginationInfo = document.getElementById('paginationInfo');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    if (filteredVisitors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">No matching visitors found</td></tr>';
        if (paginationInfo) paginationInfo.textContent = 'Showing 0-0 of 0';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
    }

    // Pagination Logic
    const totalPages = Math.ceil(filteredVisitors.length / ITEMS_PER_PAGE);

    // Ensure current page is valid
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, filteredVisitors.length);

    const pageData = filteredVisitors.slice(startIdx, endIdx);

    // Update Pagination UI
    if (paginationInfo) {
        paginationInfo.textContent = `Showing ${startIdx + 1}-${endIdx} of ${filteredVisitors.length}`;
    }

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                updateVisitorsTable();
            }
        };
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateVisitorsTable();
            }
        };
    }

    // Render Rows
    tbody.innerHTML = pageData.map(visitor => {
        const timestamp = new Date(visitor.timestamp).toLocaleString();
        const ip = visitor.ip || 'Unknown';
        const location = `${visitor.location?.city || 'Unknown'}, ${visitor.location?.country || 'Unknown'}`;
        const deviceType = visitor.device?.type || 'Unknown';
        // Use specific model if available, otherwise fallback to device type
        const deviceModel = visitor.device?.model ? `${deviceType} (${visitor.device.model})` : deviceType;

        const browser = `${visitor.device?.browser || 'Unknown'} ${visitor.device?.browserVersion || ''}`;
        const os = `${visitor.device?.os || 'Unknown'} ${visitor.device?.osVersion || ''}`;
        const isp = visitor.isp || 'Unknown';

        // Helper for badge color
        const deviceClass = deviceType.toLowerCase();

        return `
            <tr>
                <td>${timestamp}</td>
                <td><code>${ip}</code></td>
                <td><span class="location-badge">${location}</span></td>
                <td><span class="device-badge ${deviceClass}">${deviceModel}</span></td>
                <td>${browser}</td>
                <td>${os}</td>
                <td>${isp}</td>
            </tr>
        `;
    }).join('');
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();

    // Filter the global data
    filteredVisitors = visitorsData.filter(v => {
        const searchableText = [
            v.ip,
            v.location?.city,
            v.location?.country,
            v.device?.type,
            v.device?.model,
            v.device?.browser,
            v.device?.os,
            v.isp
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(searchTerm);
    });

    // Reset filtering to page 1
    currentPage = 1;

    // Re-render
    updateVisitorsTable();
});

// Export to CSV
document.getElementById('exportBtn').addEventListener('click', function () {
    if (visitorsData.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = ['Timestamp', 'IP Address', 'Country', 'City', 'Device Type', 'Device Model', 'Browser', 'OS', 'ISP'];
    const rows = visitorsData.map(v => [
        v.timestamp,
        v.ip || '',
        v.location?.country || '',
        v.location?.city || '',
        v.device?.type || '',
        v.device?.model || '',  // Added model column
        `${v.device?.browser || ''} ${v.device?.browserVersion || ''}`,
        `${v.device?.os || ''} ${v.device?.osVersion || ''}`,
        v.isp || ''
    ]);

    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitors_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
});

// =====================================================
// ANALYTICS
// =====================================================

function updateAnalytics() {
    // Update ISP table
    const ispCounts = visitorsData.reduce((acc, v) => {
        const isp = v.isp || 'Unknown';
        acc[isp] = (acc[isp] || 0) + 1;
        return acc;
    }, {});

    const sortedIsps = Object.entries(ispCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const total = visitorsData.length;
    const tbody = document.getElementById('ispTable');

    if (sortedIsps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="loading-cell">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = sortedIsps.map(([isp, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        return `
            <tr>
                <td><strong>${isp}</strong></td>
                <td>${count.toLocaleString()}</td>
                <td>${percentage}%</td>
            </tr>
        `;
    }).join('');
}

// =====================================================
// DEVICE VISITS AGGREGATION (New)
// =====================================================

function updateDeviceVisitsTable() {
    const tbody = document.getElementById('deviceVisitsTable');
    if (!tbody) return;

    if (visitorsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading-cell">No data available</td></tr>';
        return;
    }

    // specific grouping key: IP + OS + Browser + Device Model
    const deviceGroups = visitorsData.reduce((acc, v) => {
        const ip = v.ip || 'Unknown';
        const os = v.device?.os || 'Unknown';
        const model = v.device?.model || v.device?.type || 'Unknown';
        const browser = v.device?.browser || 'Unknown';

        // Create a unique key for "Device"
        const key = `${ip}|${os}|${model}|${browser}`;

        if (!acc[key]) {
            acc[key] = {
                count: 0,
                lastVisit: null,
                data: v // Keep reference to one visitor entry for details
            };
        }

        acc[key].count++;

        const visitTime = new Date(v.timestamp);
        if (!acc[key].lastVisit || visitTime > acc[key].lastVisit) {
            acc[key].lastVisit = visitTime;
            acc[key].data = v; // Update to latest visitor data for this device
        }

        return acc;
    }, {});

    // Convert to array and sort by count (descending)
    const sortedDevices = Object.values(deviceGroups).sort((a, b) => b.count - a.count);

    // Render table
    tbody.innerHTML = sortedDevices.map(group => {
        const v = group.data;
        const lastVisit = new Date(group.lastVisit).toLocaleString();
        const count = group.count;

        // Format Device Name
        let deviceName = `${v.device?.os || ''} ${v.device?.osVersion || ''}`;
        if (v.device?.model && v.device?.model !== 'Unknown') {
            deviceName += ` - ${v.device.model}`;
        } else {
            deviceName += ` (${v.device?.type || 'Unknown'})`;
        }

        // Add Browser info if needed, or keep it simple
        const subDetails = `${v.device?.browser || ''} on ${v.ip}`;

        return `
            <tr>
                <td>
                    <div style="font-weight: 600;">${deviceName}</div>
                    <div style="font-size: 0.85em; color: #6b7280; font-family: monospace;">${v.ip}</div>
                </td>
                <td>${v.location?.city || 'Unknown'}, ${v.location?.country || 'Unknown'}</td>
                <td>${v.isp || 'Unknown'}</td>
                <td>${lastVisit}</td>
                <td><span class="location-badge" style="background: rgba(99, 102, 241, 0.1); color: #6366f1;">${count} visits</span></td>
            </tr>
        `;
    }).join('');
}
// =====================================================
// MONITORED IP VISITS TABLE (New)
// =====================================================

function updateMonitoredIpTable() {
    const tbody = document.getElementById('monitoredIpTable');
    if (!tbody) return;

    if (monitoredIpVisits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">No visits from monitored IPs</td></tr>';
        return;
    }

    // Render table rows
    tbody.innerHTML = monitoredIpVisits.map(visitor => {
        const timestamp = new Date(visitor.timestamp).toLocaleString();
        const ip = visitor.ip || 'Unknown';
        const location = `${visitor.location?.city || 'Unknown'}, ${visitor.location?.country || 'Unknown'}`;
        const deviceType = visitor.device?.type || 'Unknown';
        const deviceModel = visitor.device?.model ? `${deviceType} (${visitor.device.model})` : deviceType;
        const browser = `${visitor.device?.browser || 'Unknown'} ${visitor.device?.browserVersion || ''}`;
        const os = `${visitor.device?.os || 'Unknown'} ${visitor.device?.osVersion || ''}`;
        const isp = visitor.isp || 'Unknown';

        // Helper for badge color
        const deviceClass = deviceType.toLowerCase();

        return `
            <tr>
                <td><code style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 4px 8px; border-radius: 4px; font-weight: 600;">${ip}</code></td>
                <td>${timestamp}</td>
                <td><span class="location-badge">${location}</span></td>
                <td><span class="device-badge ${deviceClass}">${deviceModel}</span></td>
                <td>${browser}</td>
                <td>${os}</td>
                <td>${isp}</td>
            </tr>
        `;
    }).join('');
}

// =====================================================
// CHARTS
// =====================================================

function updateCharts() {
    updateVisitorTrendsChart();
    updateDeviceChart();
    updateBrowserChart();
    updateOSChart();
}

function updateVisitorTrendsChart() {
    const ctx = document.getElementById('visitorTrendsChart');
    if (!ctx) return;

    // Get last 7 days data
    const last7Days = [];
    const counts = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = visitorsData.filter(v => {
            const visitTime = new Date(v.timestamp);
            return visitTime >= date && visitTime < nextDate;
        }).length;

        last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        counts.push(count);
    }

    if (charts.visitorTrends) {
        charts.visitorTrends.destroy();
    }

    charts.visitorTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Visitors',
                data: counts,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function updateDeviceChart() {
    const ctx = document.getElementById('deviceChart');
    if (!ctx) return;

    const devices = visitorsData.reduce((acc, v) => {
        const type = v.device?.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(devices);
    const data = Object.values(devices);

    if (charts.device) {
        charts.device.destroy();
    }

    charts.device = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#6366f1',
                    '#f59e0b',
                    '#10b981',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateBrowserChart() {
    const ctx = document.getElementById('browserChart');
    if (!ctx) return;

    const browsers = visitorsData.reduce((acc, v) => {
        const browser = v.device?.browser || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
    }, {});

    const sortedBrowsers = Object.entries(browsers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const labels = sortedBrowsers.map(b => b[0]);
    const data = sortedBrowsers.map(b => b[1]);

    if (charts.browser) {
        charts.browser.destroy();
    }

    charts.browser = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Visitors',
                data: data,
                backgroundColor: '#6366f1',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function updateOSChart() {
    const ctx = document.getElementById('osChart');
    if (!ctx) return;

    const oses = visitorsData.reduce((acc, v) => {
        const os = v.device?.os || 'Unknown';
        acc[os] = (acc[os] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(oses);
    const data = Object.values(oses);

    if (charts.os) {
        charts.os.destroy();
    }

    charts.os = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#ec4899',
                    '#f59e0b',
                    '#10b981',
                    '#3b82f6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// =====================================================
// INITIALIZATION
// =====================================================

console.log("Admin Dashboard Script Loaded");
console.log("Default username: admin");
console.log("To change password, use: await hashPassword('your-new-password') in console");

// =====================================================
// AUTO-LOGIN ON PAGE LOAD
// =====================================================

// Check if user was previously authenticated in this session
window.addEventListener('DOMContentLoaded', function () {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');

    if (isAuthenticated === 'true') {
        console.log('✅ Restoring admin session...');

        // Automatically show dashboard
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardScreen').style.display = 'flex';

        // Initialize Firebase and load data
        initializeFirebase();
    }
});

