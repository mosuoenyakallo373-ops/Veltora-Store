import { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, Search, ArrowRight, Menu } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Canvas Field Tote", category: "Trip Essentials", price: 58, sku: "VL-001", desc: "Waxed canvas, brass hardware, 18L." },
  { id: 2, name: "Travel Cable Roll", category: "Gadgets", price: 24, sku: "VL-002", desc: "Holds 6 cables, 2 chargers, earbuds." },
  { id: 3, name: "Ceramic Pour-Over Set", category: "Daily Practicals", price: 42, sku: "VL-003", desc: "Matte glaze, fits standard filters." },
  { id: 4, name: "Minimal Leather Wallet", category: "Accessories", price: 36, sku: "VL-004", desc: "Six-card slot, full-grain leather." },
  { id: 5, name: "Packable Rain Shell", category: "Trip Essentials", price: 64, sku: "VL-005", desc: "Folds into its own pocket, 120g." },
  { id: 6, name: "Desk Charging Tray", category: "Gadgets", price: 32, sku: "VL-006", desc: "Wireless pad + cable tray, walnut." },
  { id: 7, name: "Insulated Steel Flask", category: "Daily Practicals", price: 28, sku: "VL-007", desc: "500ml, keeps cold 24h, hot 12h." },
  { id: 8, name: "Woven Belt", category: "Accessories", price: 22, sku: "VL-008", desc: "Adjustable, brass buckle, two tones." },
  { id: 9, name: "Compression Packing Cubes", category: "Trip Essentials", price: 34, sku: "VL-009", desc: "Set of 3, zip compression." },
  { id: 10, name: "Reading Light Clip", category: "Gadgets", price: 19, sku: "VL-010", desc: "Rechargeable, three brightness modes." },
  { id: 11, name: "Linen Tea Towel Set", category: "Daily Practicals", price: 26, sku: "VL-011", desc: "Set of 3, stonewashed linen." },
  { id: 12, name: "Sunglasses Case", category: "Accessories", price: 18, sku: "VL-012", desc: "Molded EVA, microfiber lining." },
];

const CATEGORIES = ["All", "Daily Practicals", "Trip Essentials", "Accessories", "Gadgets"];

export default function Veltora() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#1C1B1A] font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'Source Serif 4', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F2EDE4]/90 backdrop-blur-sm border-b border-[#1C1B1A]/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-display font-700 text-2xl tracking-tight">VELTORA</div>

          <nav className="hidden md:flex items-center gap-8 font-display text-sm uppercase tracking-wide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pb-1 border-b-2 transition-colors ${
                  activeCategory === cat
                    ? "border-[#C97B5E] text-[#1C1B1A]"
                    : "border-transparent text-[#6E6A66] hover:text-[#1C1B1A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/60 rounded-full px-3 py-1.5 border border-[#1C1B1A]/10">
              <Search size={15} className="text-[#6E6A66]" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-28 placeholder:text-[#6E6A66]"
              />
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-[#1C1B1A]/5 rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C97B5E] text-white text-[10px] font-mono w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen((m) => !m)}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col gap-3 px-6 pb-4 font-display text-sm uppercase tracking-wide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setMenuOpen(false);
                }}
                className={`text-left ${
                  activeCategory === cat ? "text-[#C97B5E]" : "text-[#6E6A66]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8A9B8E] mb-4">
              The everyday carry, considered
            </p>
            <h1 className="font-display font-700 text-5xl md:text-7xl leading-[1.05] tracking-tight">
              Pack light.
              <br />
              Live well.
            </h1>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-[#1C1B1A]/80 leading-relaxed max-w-md">
              Veltora makes the things you reach for every day — at home, at your desk, or
              halfway across the world. Built to last, simple to use.
            </p>
            <button
              onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-wide bg-[#1C1B1A] text-[#F2EDE4] px-6 py-3 rounded-full hover:bg-[#1C1B1A]/85 transition-colors"
            >
              Shop the collection <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Pack list strip - signature element */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-white/50 border border-[#1C1B1A]/10 rounded-2xl p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6E6A66] mb-6">
            Today's pack list
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {PRODUCTS.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className="bg-[#F2EDE4] border border-[#1C1B1A]/10 rounded-xl px-4 py-3 shadow-sm"
                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1 + i)}deg)` }}
              >
                <p className="font-display text-sm font-500">{p.name}</p>
                <p className="font-mono text-xs text-[#8A9B8E] mt-1">{p.sku}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section id="shop" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display font-600 text-2xl md:text-3xl tracking-tight">
            {activeCategory === "All" ? "All products" : activeCategory}
          </h2>
          <p className="font-mono text-xs text-[#6E6A66]">{filtered.length} items</p>
        </div>

        {filtered.length === 0 ? (
          <p className="text-[#6E6A66] py-12 text-center">
            Nothing matches "{search}". Try a different search.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="group bg-white/60 border border-[#1C1B1A]/10 rounded-xl p-4 flex flex-col hover:border-[#C97B5E]/40 transition-colors"
              >
                <div className="aspect-square bg-[#1C1B1A]/5 rounded-lg mb-3 flex items-center justify-center">
                  <span className="font-mono text-[10px] text-[#6E6A66] uppercase tracking-wide">
                    {p.sku}
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A9B8E] mb-1">
                  {p.category}
                </p>
                <h3 className="font-display font-500 text-base leading-snug mb-1">{p.name}</h3>
                <p className="text-sm text-[#6E6A66] mb-3 flex-1">{p.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-mono text-sm">${p.price}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="font-display text-xs uppercase tracking-wide bg-[#1C1B1A] text-[#F2EDE4] px-3 py-2 rounded-full hover:bg-[#C97B5E] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1C1B1A]/10 bg-white/40">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm">
          <div>
            <p className="font-display font-700 text-lg mb-2">VELTORA</p>
            <p className="text-[#6E6A66] max-w-xs">
              Everyday essentials, trip gear, accessories, and small tools — made to be used,
              not stored.
            </p>
          </div>
          <div className="flex gap-12 font-mono text-xs uppercase tracking-wide text-[#6E6A66]">
            <div className="space-y-2">
              <p className="text-[#1C1B1A]">Shop</p>
              <p>Daily Practicals</p>
              <p>Trip Essentials</p>
              <p>Accessories</p>
              <p>Gadgets</p>
            </div>
            <div className="space-y-2">
              <p className="text-[#1C1B1A]">Help</p>
              <p>Shipping</p>
              <p>Returns</p>
              <p>Contact</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-6 font-mono text-[10px] text-[#6E6A66]">
          © 2026 Veltora. All rights reserved.
        </div>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#1C1B1A]/40"
            onClick={() => setCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#F2EDE4] h-full p-6 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-600 text-xl">Your bag</h2>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-[#6E6A66] flex-1">Your bag is empty. Add something from the shop.</p>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center border-b border-[#1C1B1A]/10 pb-3">
                    <div className="w-16 h-16 bg-[#1C1B1A]/5 rounded-lg flex items-center justify-center font-mono text-[9px] text-[#6E6A66]">
                      {item.sku}
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-500 text-sm">{item.name}</p>
                      <p className="font-mono text-xs text-[#6E6A66]">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center border border-[#1C1B1A]/15 rounded-full hover:bg-white"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-sm w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center border border-[#1C1B1A]/15 rounded-full hover:bg-white"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#1C1B1A]/10">
                <div className="flex justify-between font-display font-600 text-lg mb-4">
                  <span>Total</span>
                  <span className="font-mono">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-[#1C1B1A] text-[#F2EDE4] font-display uppercase text-sm tracking-wide py-3 rounded-full hover:bg-[#C97B5E] transition-colors">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
