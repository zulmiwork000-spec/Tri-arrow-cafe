// ============================================================
// /api/place-order.js
// This file runs ONLY on Vercel's server — it never reaches
// the customer's browser. This is where your real Rista
// API key belongs (as an Environment Variable, set in the
// Vercel dashboard — NEVER write the key directly in this file).
//
// Why this matters: anything in /src (frontend) is downloadable
// by anyone who visits your site. Anything in /api (backend)
// stays on Vercel's servers. Secrets go here, never in /src.
// ============================================================

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, customer, promoCode, subtotal } = req.body;

    // ---------- Basic server-side validation ----------
    // Never trust data from the browser at face value. Re-check
    // everything that affects money or personal data here.
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ error: "Missing required customer details" });
    }
    // Basic phone sanity check (India: 10 digits, optionally with +91)
    const phoneDigits = customer.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // ---------- Recalculate price server-side ----------
    // Never trust a "total" sent from the browser — recompute
    // it from your own menu/price source of truth so a tampered
    // request can't place a ₹2000 order for ₹2.
    // (In production, import your menu data here too, or fetch
    // current prices from Rista directly.)
    const recalculatedSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // ---------- Apply promo (server-side, authoritative) ----------
    let discount = 0;
    if (promoCode) {
      discount = await validatePromoServerSide(promoCode, recalculatedSubtotal);
    }

    const deliveryFee = recalculatedSubtotal - discount >= 250 ? 0 : 30;
    const finalTotal = recalculatedSubtotal - discount + deliveryFee;

    // ---------- Forward to Rista ----------
    // Replace this URL/payload shape with the exact format from
    // your Rista API docs. Your account manager's docs will
    // specify the real endpoint and required fields.
    const ristaResponse = await fetch("https://api.dotpe.in/rista/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Your secret key lives ONLY in Vercel's environment
        // variables — set RISTA_API_KEY there, never here.
        Authorization: `Bearer ${process.env.RISTA_API_KEY}`,
      },
      body: JSON.stringify({
        merchant_id: process.env.RISTA_MERCHANT_ID,
        customer_name: customer.name,
        customer_phone: phoneDigits,
        delivery_address: customer.address,
        notes: customer.notes || "",
        items: items.map((i) => ({
          name: i.name,
          quantity: i.qty,
          price: i.price,
        })),
        subtotal: recalculatedSubtotal,
        discount,
        delivery_fee: deliveryFee,
        total: finalTotal,
        source: "website",
      }),
    });

    if (!ristaResponse.ok) {
      // Don't leak internal error details to the customer
      console.error("Rista API error:", await ristaResponse.text());
      return res.status(502).json({ error: "Could not reach kitchen system. Please call us directly." });
    }

    const ristaData = await ristaResponse.json();

    return res.status(200).json({
      success: true,
      orderId: ristaData.order_id || ristaData.id,
      total: finalTotal,
    });
  } catch (err) {
    console.error("Order placement failed:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again or call us." });
  }
}

// ------------------------------------------------------------
// Server-side promo validation — the ONLY version that counts.
// The frontend shows promo labels for UX, but this function
// is what actually determines the discount applied to payment.
// ------------------------------------------------------------
async function validatePromoServerSide(code, subtotal) {
  const PROMOS = {
    WELCOME50: { amount: 50, minOrder: 200, type: "flat" },
    TAC10: { amount: 0.1, minOrder: 300, type: "percent", maxDiscount: 100 },
    FREESHIP: { amount: 0, minOrder: 0, type: "shipping" },
  };

  const promo = PROMOS[code?.toUpperCase()];
  if (!promo) return 0;
  if (subtotal < promo.minOrder) return 0;

  // TODO: add real fraud checks here once you have order history,
  // e.g. "WELCOME50 only on customer's first order" would need
  // a lookup against your customer database by phone number.

  if (promo.type === "flat") return promo.amount;
  if (promo.type === "percent") return Math.min(subtotal * promo.amount, promo.maxDiscount);
  return 0;
}
