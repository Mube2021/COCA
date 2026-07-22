import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily for AI Inventory Copilot
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Mohammed Awel Coca Distributor - Buno Bedele Zone",
    time: new Date().toISOString(),
  });
});

// AI Copilot Endpoint for Beverage Distribution & Inventory Guidance
app.post("/api/copilot", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured yet in Settings > Secrets.",
      });
    }

    const systemInstruction = `
You are the Smart Inventory & Operations AI Assistant for "Mohammed Awel Coca Distributor", the official authorized Coca-Cola distributor for the Buno Bedele Zone in Ethiopia.
Company Profile:
- Business Name: Mohammed Awel Coca Distributor
- Tagline: "Delivering Refreshment Across Buno Bedele Zone"
- Locations served: Bedele Town, Metu, Dembi, Chora, Chewaka, Dabo Hana, Gechi, and surrounding areas.
- Primary Products & Standard Prices (in Ethiopian Birr - ETB):
  - Coca-Cola 300ml Glass Bottle: 18 Birr
  - Coca-Cola 1 Liter Plastic/Glass: 42 Birr
  - Fanta Orange 300ml: 18 Birr
  - Sprite 300ml: 18 Birr
  - Fanta Pineapple 300ml: 18 Birr
  - Schweppes 300ml: 18 Birr
  - Minute Maid 350ml Juice: 28 Birr
- Bottle Deposit: Standard deposit is 10 Birr per returned empty 300ml glass bottle, 24 bottles per crate.

Your Job:
1. Provide concise, expert operational insights for inventory, glass bottle returns, delivery routes, sales targets, customer credit risk, and profit margins.
2. If asked in Afaan Oromo or English, reply accordingly in clear, polite language.
3. Keep answers concise, actionable, and formatted with bullet points if necessary.
Current System Context provided: ${JSON.stringify(context || {})}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Copilot Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate AI response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mohammed Awel Coca Distributor server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
