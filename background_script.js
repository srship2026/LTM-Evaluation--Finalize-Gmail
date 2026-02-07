// আপনার লাইভ এপিআই ইউআরএল
const API_BASE = "https://ltm-evaluation-finalize-gmail.vercel.app/api/auth/verify";

// যে অ্যাপের জন্য এই এক্সটেনশন, তার আইডি এখানে দিন (তামপারমাঙ্কি স্ক্রিপ্টের মতোই)
const CURRENT_APP_ID = "LTM_EVAL_FINAL_UPDATE"; 

// পপআপ বা কন্টেন্ট স্ক্রিপ্ট থেকে মেসেজ আসলে এটি কাজ করবে
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "verifyEmail") {
        // এখানে রিকোয়েস্ট থেকে ইমেইল এবং আমাদের ডিফাইন করা appId পাঠানো হচ্ছে
        verifyEmail(request.email, CURRENT_APP_ID).then(result => {
            sendResponse(result);
        });

        return true; // এসিনক্রোনাস রেসপন্সের জন্য চ্যানেল খোলা রাখবে
    }
});

// ইউজার ভেরিফিকেশন ফাংশন
async function verifyEmail(email, appId) {
    try {
        // ভুল সংশোধন: API_URL এর বদলে API_BASE ব্যবহার করা হয়েছে এবং appId যোগ করা হয়েছে
        // অবশ্যই ব্যাকটিক ( ` ) ব্যবহার করবেন
        const res = await fetch(`${API_BASE}?email=${encodeURIComponent(email)}&appId=${appId}`);
        
        if (!res.ok) {
            return { success: false, message: "Server error or Invalid AppID" };
        }

        const data = await res.json();

        // সার্ভার থেকে allowed: true আসলে
        if (data.allowed === true || data.success === true) {
            return { success: true, message: "Email Verified ✔ Allowed User" };
        } else {
            return { success: false, message: "❌ Not Allowed for this App" };
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        return { success: false, message: "Network/Server Error" };
    }
}
