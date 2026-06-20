import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Plus, Minus, ShoppingBag, X, Phone, Clock, MapPin, Instagram,
  ChevronRight, Tag, Check, AlertCircle, Sparkles, Loader2
} from "lucide-react";
import { MENU, CATEGORY_ORDER, ALL_ITEMS, MEAL_UPSELL, getSuggestions, PROMO_DISPLAY } from "./menuData.js";
import "./styles.css";

const PHONE_DISPLAY = "+91 81684 21932";
const PHONE_TEL = "+918168421932";
const FREE_DELIVERY_THRESHOLD = 250;

function currency(n) {
  return `₹${Math.round(n)}`;
}

// ---------- Tri Arrow mark ----------
function ArrowMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 4 L31 18 L24 14 L17 18 Z" fill="currentColor" />
      <path d="M24 4 L31 18 L24 14 L17 18 Z" fill="currentColor" transform="rotate(120 24 24)" />
      <path d="M24 4 L31 18 L24 14 L17 18 Z" fill="currentColor" transform="rotate(240 24 24)" />
    </svg>
  );
}

export default function App() {
  const [cart, setCart] = useState({}); // id -> { item, qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ORDER[0]);
  const [toast, setToast] = useState(null);
  const [step, setStep] = useState("cart"); // cart | details | placing | confirmed | error
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", notes: "" });
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [dismissedUpsell, setDismissedUpsell] = useState({});
  const sectionRefs = useRef({});
  const toastTimer = useRef(null);
  const heroRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const cartList = Object.values(cart).filter((c) => c.qty > 0);
  const cartCount = cartList.reduce((s, c) => s + c.qty, 0);
  const subtotal = cartList.reduce((s, c) => s + c.qty * c.item.price, 0);

  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    const promo = PROMO_DISPLAY[appliedPromo];
    if (!promo) return 0;
    if (subtotal < promo.minOrder) return 0;
    if (appliedPromo === "WELCOME50") return Math.min(50, subtotal);
    if (appliedPromo === "TAC10") return Math.min(subtotal * 0.1, 100);
    return 0;
  }, [appliedPromo, subtotal]);

  const freeShipping = appliedPromo === "FREESHIP";
  const deliveryFee = subtotal === 0 ? 0 : (freeShipping || subtotal - promoDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : 30);
  const total = Math.max(0, subtotal - promoDiscount) + deliveryFee;
  const toFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - (subtotal - promoDiscount));

  function showToast(msg) {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }

  function addItem(item, qtyDelta = 1) {
    setCart((prev) => {
      const existing = prev[item.id];
      const newQty = Math.max(0, (existing?.qty || 0) + qtyDelta);
      return { ...prev, [item.id]: { item, qty: newQty } };
    });
    if (qtyDelta > 0) showToast(`Added ${item.name}`);
  }

  function qtyFor(id) {
    return cart[id]?.qty || 0;
  }

  function scrollToCategory(cat) {
    setActiveCategory(cat);
    sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCategory(entry.target.dataset.category);
        });
      },
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // 3D hero tilt on pointer move (desktop only, respects reduced motion)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    function handleMove(e) {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x, y });
    }
    const el = heroRef.current;
    el?.addEventListener("mousemove", handleMove);
    return () => el?.removeEventListener("mousemove", handleMove);
  }, []);

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const promo = PROMO_DISPLAY[code];
    if (!promo) {
      setPromoError("That code isn't valid");
      return;
    }
    if (subtotal < promo.minOrder) {
      setPromoError(`Add ${currency(promo.minOrder - subtotal)} more to use this code`);
      return;
    }
    setAppliedPromo(code);
    setPromoError("");
    showToast("Promo applied");
  }

  function removePromo() {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  }

  // Suggestions for checkout — excludes items already in cart
  const suggestions = useMemo(() => getSuggestions(Object.keys(cart).filter((id) => cart[id].qty > 0), 4), [cart]);

  // Meal upsell — check if cart has a standalone item whose category qualifies, and the meal isn't built yet
  const activeUpsell = useMemo(() => {
    for (const c of cartList) {
      const upsell = MEAL_UPSELL[c.item.type];
      if (!upsell) continue;
      const key = `${c.item.id}`;
      if (dismissedUpsell[key]) continue;
      const sideCat = MENU[upsell.sideCategory];
      const drinkCat = MENU[upsell.drinkCategory];
      const hasSide = sideCat.items.some((i) => qtyFor(i.id) > 0);
      const hasDrink = drinkCat.items.some((i) => qtyFor(i.id) > 0);
      if (hasSide && hasDrink) continue; // already a meal
      return { forItem: c.item, upsell, key };
    }
    return null;
  }, [cartList, dismissedUpsell, cart]);

  async function placeOrder(e) {
    e.preventDefault();
    setStep("placing");
    setOrderError("");

    const payload = {
      items: cartList.map((c) => ({ name: c.item.name, price: c.item.price, qty: c.qty })),
      customer,
      promoCode: appliedPromo,
      subtotal,
    };

    try {
      // This calls YOUR backend (/api/place-order), which holds the
      // real Rista key server-side and forwards the order safely.
      // Locally / in this preview, that endpoint doesn't exist yet —
      // once deployed to Vercel with your Rista keys set, this works for real.
      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not place order");
      }
      setStep("confirmed");
    } catch (err) {
      // Graceful fallback: WhatsApp handoff so an order is never lost,
      // even if the backend isn't deployed yet or has a hiccup.
      setOrderError(err.message || "Connection issue — you can still send your order via WhatsApp below.");
      setStep("error");
    }
  }

  function whatsappLink() {
    const lines = cartList.map((c) => `${c.qty}x ${c.item.name} - ${currency(c.qty * c.item.price)}`).join("%0A");
    const promoLine = appliedPromo ? `%0APromo: ${appliedPromo} (-${currency(promoDiscount)})` : "";
    const msg = `*New Order - Tri Arrow Cafe*%0A%0A${lines}${promoLine}%0A%0ASubtotal: ${currency(subtotal)}%0ADelivery: ${deliveryFee === 0 ? "FREE" : currency(deliveryFee)}%0A*Total: ${currency(total)}*%0A%0AName: ${customer.name}%0APhone: ${customer.phone}%0AAddress: ${customer.address}${customer.notes ? `%0ANotes: ${customer.notes}` : ""}`;
    return `https://wa.me/918168421932?text=${msg}`;
  }

  function resetOrder() {
    setCart({});
    setStep("cart");
    setCartOpen(false);
    setCustomer({ name: "", phone: "", address: "", notes: "" });
    setAppliedPromo(null);
    setPromoInput("");
  }

  return (
    <div className="root">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand">
            <ArrowMark size={24} />
            <div className="brand-text">
              TRI ARROW<span>CAFE</span>
            </div>
          </div>
          <div className="nav-right">
            <a className="nav-phone" href={`tel:${PHONE_TEL}`}>
              <Phone size={14} /> {PHONE_DISPLAY}
            </a>
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={16} />
              <span className="cart-btn-label">Order</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-grain" />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="dot" /> Open now · 11:00–22:00</div>
            <h1 className="hero-title">
              Fire-finished pizza,
              <br />
              <span className="hero-title-ember">built for tonight.</span>
            </h1>
            <p className="hero-sub">
              Fresh dough daily, hand-picked toppings, combos worth the order. Free delivery above ₹250.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollToCategory(CATEGORY_ORDER[0])}>
                See the menu <ChevronRight size={16} />
              </button>
              <button className="btn-ghost" onClick={() => setCartOpen(true)}>
                <ShoppingBag size={15} /> Quick order
              </button>
            </div>
          </div>
          <div
            className="hero-3d"
            style={{
              transform: `rotateY(${tilt.x * 14}deg) rotateX(${-tilt.y * 14}deg)`,
            }}
          >
            <div className="disc-layer disc-back" />
            <div className="disc-layer disc-crust" />
            <div className="disc-layer disc-sauce" />
            <div className="topping t1" />
            <div className="topping t2" />
            <div className="topping t3" />
            <div className="topping t4" />
            <div className="topping t5" />
            <div className="steam s1" />
            <div className="steam s2" />
          </div>
        </div>
        <div className="hero-ticker">
          <div className="ticker-track">
            {[1, 2].map((r) => (
              <React.Fragment key={r}>
                <span>FREE DELIVERY ABOVE ₹250</span>
                <span className="tick-sep">/</span>
                <span>FRESH DOUGH, MADE DAILY</span>
                <span className="tick-sep">/</span>
                <span>{PHONE_DISPLAY}</span>
                <span className="tick-sep">/</span>
                <span>@TRIARROWCAFE</span>
                <span className="tick-sep">/</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="menu-section">
        <div className="menu-header">
          <span className="eyebrow-small">Full Menu</span>
          <h2 className="section-title">What are you craving?</h2>
        </div>

        <div className="menu-layout">
          <div className="cat-nav">
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                className={`cat-link ${activeCategory === cat ? "active" : ""}`}
                onClick={() => scrollToCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="cat-content">
            {CATEGORY_ORDER.map((cat) => (
              <div key={cat} className="cat-section" data-category={cat} ref={(el) => (sectionRefs.current[cat] = el)}>
                <div className="cat-section-head">
                  <h3>{cat}</h3>
                  {MENU[cat].sub && <span className="cat-sub">{MENU[cat].sub}</span>}
                </div>
                <div className="item-grid">
                  {MENU[cat].items.map((item) => {
                    const qty = qtyFor(item.id);
                    return (
                      <div className="item-card" key={item.id}>
                        {item.tags?.includes("bestseller") && <span className="badge-best"><Sparkles size={11} /> Bestseller</span>}
                        <div className="item-card-top">
                          <div>
                            <div className="item-name">{item.name}</div>
                            {item.desc && <div className="item-desc">{item.desc}</div>}
                          </div>
                        </div>
                        <div className="item-card-bottom">
                          <div className="item-price">
                            {currency(item.price)}
                            {item.priceL ? <span className="price-l"> / {currency(item.priceL)}</span> : ""}
                          </div>
                          {qty === 0 ? (
                            <button className="add-btn" onClick={() => addItem(item, 1)}>Add</button>
                          ) : (
                            <div className="qty-stepper">
                              <button onClick={() => addItem(item, -1)}><Minus size={13} /></button>
                              <span>{qty}</span>
                              <button onClick={() => addItem(item, 1)}><Plus size={13} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <ArrowMark size={20} /> TRI ARROW CAFE
            <p>Crafted with fresh dough &amp; hand-picked ingredients, delivered daily.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Contact</h4>
              <div><Phone size={13} /> {PHONE_DISPLAY}</div>
              <div><Instagram size={13} /> @triarrowcafe</div>
            </div>
            <div className="footer-col">
              <h4>Hours</h4>
              <div><Clock size={13} /> 11:00 AM – 10:00 PM</div>
              <div><MapPin size={13} /> Free delivery above ₹250</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Tri Arrow Cafe · Also on Zomato</div>
      </footer>

      {/* MOBILE STICKY BAR */}
      {cartCount > 0 && (
        <button className="mobile-bar" onClick={() => setCartOpen(true)}>
          <span>{cartCount} item{cartCount !== 1 ? "s" : ""} · {currency(subtotal)}</span>
          <span className="mobile-bar-cta">View cart <ChevronRight size={15} /></span>
        </button>
      )}

      {/* CART / CHECKOUT DRAWER */}
      <div className={`overlay ${cartOpen ? "open" : ""}`} onClick={() => { setCartOpen(false); }} />
      <div className={`drawer ${cartOpen ? "open" : ""}`}>
        <div className="drawer-head">
          <h3>
            {step === "cart" && "Your order"}
            {step === "details" && "Delivery details"}
            {(step === "placing") && "Placing order…"}
            {step === "confirmed" && "Order confirmed"}
            {step === "error" && "One more step"}
          </h3>
          <button className="icon-btn" onClick={() => setCartOpen(false)}><X size={20} /></button>
        </div>

        <div className="drawer-body">
          {step === "cart" && (
            cartList.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={36} strokeWidth={1.5} />
                <div className="empty-title">Your cart is empty</div>
                <div className="empty-sub">Add something from the menu to get started</div>
              </div>
            ) : (
              <>
                {subtotal > 0 && toFreeDelivery > 0 && !freeShipping && (
                  <div className="free-bar">
                    Add <strong>{currency(toFreeDelivery)}</strong> more for free delivery
                    <div className="free-track"><div className="free-fill" style={{ width: `${Math.min(100, ((subtotal - promoDiscount) / FREE_DELIVERY_THRESHOLD) * 100)}%` }} /></div>
                  </div>
                )}

                {cartList.map((c) => (
                  <div className="cart-line" key={c.item.id}>
                    <div className="cart-line-info">
                      <div className="cart-line-name">{c.item.name}</div>
                      <div className="cart-line-price">{currency(c.item.price)} each</div>
                    </div>
                    <div className="qty-stepper qty-stepper-light">
                      <button onClick={() => addItem(c.item, -1)}><Minus size={12} /></button>
                      <span>{c.qty}</span>
                      <button onClick={() => addItem(c.item, 1)}><Plus size={12} /></button>
                    </div>
                    <div className="cart-line-total">{currency(c.qty * c.item.price)}</div>
                  </div>
                ))}

                {/* MAKE IT A MEAL upsell */}
                {activeUpsell && (
                  <div className="upsell-card">
                    <button className="upsell-dismiss" onClick={() => setDismissedUpsell((p) => ({ ...p, [activeUpsell.key]: true }))}>
                      <X size={13} />
                    </button>
                    <div className="upsell-label"><Sparkles size={14} /> {activeUpsell.upsell.label}</div>
                    <div className="upsell-desc">
                      Add a side from <strong>{activeUpsell.upsell.sideCategory}</strong> and a drink from <strong>{activeUpsell.upsell.drinkCategory}</strong> — save {currency(activeUpsell.upsell.discount)} when bundled with your {activeUpsell.forItem.name}.
                    </div>
                    <div className="upsell-options">
                      {MENU[activeUpsell.upsell.sideCategory].items.slice(0, 3).map((side) => (
                        <button key={side.id} className="upsell-chip" onClick={() => addItem(side, 1)}>
                          + {side.name} ({currency(side.price)})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROMO CODE */}
                <div className="promo-block">
                  {appliedPromo ? (
                    <div className="promo-applied">
                      <div className="promo-applied-left">
                        <Tag size={15} />
                        <div>
                          <div className="promo-code">{appliedPromo}</div>
                          <div className="promo-saved">You're saving {appliedPromo === "FREESHIP" ? "on delivery" : currency(promoDiscount)}</div>
                        </div>
                      </div>
                      <button className="promo-remove" onClick={removePromo}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="promo-input-row">
                        <input
                          placeholder="Promo code"
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                        />
                        <button onClick={applyPromo}>Apply</button>
                      </div>
                      {promoError && <div className="promo-error"><AlertCircle size={13} /> {promoError}</div>}
                      <div className="promo-hints">Try WELCOME50, TAC10, or FREESHIP</div>
                    </>
                  )}
                </div>

                {/* SUGGESTIONS */}
                {suggestions.length > 0 && (
                  <div className="suggest-block">
                    <div className="suggest-title">Goes well with your order</div>
                    <div className="suggest-row">
                      {suggestions.map((s) => (
                        <button key={s.id} className="suggest-card" onClick={() => addItem(s, 1)}>
                          {s.tags?.includes("bestseller") && <span className="suggest-badge">★</span>}
                          <div className="suggest-name">{s.name}</div>
                          <div className="suggest-price">{currency(s.price)}</div>
                          <div className="suggest-add"><Plus size={13} /></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          )}

          {step === "details" && (
            <>
              <button className="back-link" onClick={() => setStep("cart")}>← Back to cart</button>
              <div className="summary-mini">
                <div className="row"><span>{cartCount} items</span><span>{currency(subtotal)}</span></div>
                {appliedPromo && <div className="row promo-row"><span>{appliedPromo}</span><span>−{currency(promoDiscount)}</span></div>}
              </div>
              <form id="checkout-form" onSubmit={placeOrder}>
                <div className="field">
                  <label>Full name</label>
                  <input required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Your name" autoComplete="name" />
                </div>
                <div className="field">
                  <label>Phone number</label>
                  <input required type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="10-digit mobile number" autoComplete="tel" />
                </div>
                <div className="field">
                  <label>Delivery address</label>
                  <textarea required value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="House/flat no, street, landmark, area" autoComplete="street-address" />
                </div>
                <div className="field">
                  <label>Notes (optional)</label>
                  <input value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} placeholder="e.g. less spicy, ring the bell" />
                </div>
                <div className="privacy-note">
                  <AlertCircle size={13} /> Your details are sent directly and securely to our kitchen system to fulfill this order — never stored for marketing or shared with third parties.
                </div>
              </form>
            </>
          )}

          {step === "placing" && (
            <div className="placing-wrap">
              <Loader2 size={32} className="spin" />
              <div className="placing-text">Sending your order to the kitchen…</div>
            </div>
          )}

          {step === "confirmed" && (
            <div className="confirm-wrap">
              <div className="confirm-icon"><Check size={30} color="white" strokeWidth={3} /></div>
              <h3>Order placed!</h3>
              <p>Tri Arrow Cafe has received your order and is firing up the oven. You'll get a call to confirm delivery details shortly.</p>
              <button className="new-order-btn" onClick={resetOrder}>Start a new order</button>
            </div>
          )}

          {step === "error" && (
            <div className="confirm-wrap">
              <div className="confirm-icon confirm-icon-warn"><AlertCircle size={28} color="white" /></div>
              <h3>Couldn't reach the kitchen system</h3>
              <p>{orderError} Don't worry — your order isn't lost. Send it directly on WhatsApp and we'll get it right away.</p>
              <a className="wa-btn" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Send order on WhatsApp</a>
              <button className="new-order-btn" onClick={() => setStep("details")}>Try again</button>
            </div>
          )}
        </div>

        {step === "cart" && cartList.length > 0 && (
          <div className="drawer-foot">
            <div className="row"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
            {promoDiscount > 0 && <div className="row promo-row"><span>Promo ({appliedPromo})</span><span>−{currency(promoDiscount)}</span></div>}
            <div className="row"><span>Delivery</span><span>{deliveryFee === 0 ? "FREE" : currency(deliveryFee)}</span></div>
            <div className="row total"><span>Total</span><span>{currency(total)}</span></div>
            <button className="checkout-btn" onClick={() => setStep("details")}>
              Proceed to checkout <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === "details" && (
          <div className="drawer-foot">
            <div className="row total"><span>Total</span><span>{currency(total)}</span></div>
            <button type="submit" form="checkout-form" className="checkout-btn">
              Place order <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {toast && <div className="toast toast-show"><Check size={15} strokeWidth={3} /><span>{toast}</span></div>}
    </div>
  );
}
