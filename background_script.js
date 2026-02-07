const API_BASE = "https://ltm-evaluation-finalize-gmail.vercel.app/api/auth/verify";
const CURRENT_APP_ID = "LTM_EVAL_FINAL_UPDATE"; // আপনার অ্যাপ আইডি

// মেসেজ লিসেনার
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // ১. ভেরিফিকেশন চেক করা (API এর মাধ্যমে)
    if (request.type === "verifyEmail") {
        verifyUser(request.email).then(sendResponse);
        return true; 
    }

    // ২. বর্তমান স্ট্যাটাস জানা (পপআপ বা কন্টেন্ট স্ক্রিপ্টের জন্য)
    if (request.action === "isVerified") {
        chrome.storage.local.get(["verifiedEmail"], (data) => {
            sendResponse({ verified: !!data.verifiedEmail, email: data.verifiedEmail });
        });
        return true;
    }

    // ৩. ম্যানুয়ালি ভেরিফিকেশন সেট করা (যদি প্রয়োজন হয়)
    if (request.action === "setVerified") {
        chrome.storage.local.set({ verifiedEmail: request.email }, () => {
            sendResponse({ success: true });
        });
        return true;
    }

    // ৪. লগআউট বা লাইসেন্স ক্লিয়ার করা
    if (request.action === "logout") {
        chrome.storage.local.remove("verifiedEmail", () => {
            sendResponse({ success: true });
        });
        return true;
    }
});

// মেইন ভেরিফিকেশন ফাংশন
async function verifyUser(email) {
    try {
        const res = await fetch(`${API_BASE}?email=${encodeURIComponent(email)}&appId=${CURRENT_APP_ID}`);
        if (!res.ok) return { success: false, message: "Server Error" };

        const data = await res.json();

        if (data.allowed === true || data.success === true) {
            // স্টোরেজে সেভ করে রাখা হচ্ছে যাতে সার্ভিস ওয়ার্কার বন্ধ হলেও ডাটা না হারায়
            await chrome.storage.local.set({ verifiedEmail: email });
            return { success: true, message: "Verified ✔" };
        } else {
            return { success: false, message: "❌ Access Denied" };
        }
    } catch (err) {
        return { success: false, message: "Network Error" };
    }
}
