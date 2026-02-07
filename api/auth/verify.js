import allowedData from "../../allowed.json";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { email, appId } = req.query; // appId রিসিভ করছে

  if (!email || !appId) {
    return res.status(400).json({ success: false, message: "Email and AppID are required" });
  }

  // চেক করবে এই অ্যাপের আন্ডারে এই ইমেইলটি আছে কি না
  const appList = allowedData.apps[appId];
  const isAllowed = appList && appList.includes(email);

  if (isAllowed) {
    return res.status(200).json({ success: true, allowed: true });
  }

  return res.status(403).json({ success: false, allowed: false });
}
