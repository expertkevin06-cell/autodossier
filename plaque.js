// Vercel Serverless Function — /api/plaque?immat=AB-123-CD
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const immat = req.query.immat || "";
  if (!immat) return res.status(400).json({ error: "Paramètre immat manquant" });

  const p = immat.trim().toUpperCase().replace(/[\s\-]/g, "");
  const plate = /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(p)
    ? `${p.slice(0,2)}-${p.slice(2,5)}-${p.slice(5)}`
    : immat.trim().toUpperCase();

  const token = process.env.API_TOKEN || "TokenDemo2026B";
  const url = `https://api.apiplaqueimmatriculation.com/get-vehicule-info?immatriculation=${encodeURIComponent(plate)}&token=${token}&pays=FR`;

  try {
    const r = await fetch(url, { method: "POST", headers: { Accept: "application/json" } });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
