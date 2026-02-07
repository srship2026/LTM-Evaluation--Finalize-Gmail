import allowedData from "../../allowed.json";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // ইমেইল এবং অ্যাপ আইডি উভয়ই গ্রহণ করবে
  const { email, appId } = req.query;

  if (!email || !appId) {
    return res.status(400).json({ success: false, message: "Email and AppID are required" });
  }

  // চেক করবে এই অ্যাপ আইডির জন্য এই ইমেইলটি অনুমোদিত কি না
  const appAllowedList = allowedData.apps[appId];
  const isAllowed = appAllowedList && appAllowedList.includes(email);

  if (isAllowed) {
    return res.status(200).json({ success: true, allowed: true });
  }

  return res.status(403).json({ success: false, allowed: false });
}
