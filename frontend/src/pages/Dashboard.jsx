import { useEffect, useState } from "react";
import StockCard from "../components/StockCard";
import Watchlist from "../components/Watchlist";

const API = "http://localhost:4000/api";
const MAX_POINTS = 20;

export default function Dashboard({ user, logout }) {
  const [stocks, setStocks] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState("supported"); // NEW

  // Initial stock load
  useEffect(() => {
    fetch(`${API}/stocks`)
      .then(res => res.json())
      .then(data => {
        const init = {};
        data.forEach(s => {
          init[s.symbol] = {
            symbol: s.symbol,
            prices: [s.price],
            current: s.price,
            prev: s.price
          };
        });
        setStocks(init);
      });
  }, []);

  // Poll prices
  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch(`${API}/stocks`);
      const data = await res.json();

      setStocks(prev => {
        const updated = { ...prev };
        data.forEach(s => {
          const p = updated[s.symbol];
          if (!p) return;

          updated[s.symbol] = {
            ...p,
            prev: p.current,
            current: s.price,
            prices: [...p.prices, s.price].slice(-MAX_POINTS)
          };
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  // Subscribe / Unsubscribe
  const toggleSubscribe = async symbol => {
    const isSubscribed = watchlist.includes(symbol);

    if (isSubscribed) {
      await fetch(`${API}/subscriptions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, symbol })
      });

      setWatchlist(w => w.filter(s => s !== symbol));
    } else {
      await fetch(`${API}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, symbol })
      });

      setWatchlist(w => [...w, symbol]);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="brand">
          <img src="/logos/stock_logo.png" alt="logo" />
          <div>
            <strong>ProfitSetu</strong>
            <div className="tagline">Smart Analytics for Smarter Investments</div>
          </div>
        </div>
        <div className="user-info">
          <span className="user-email">Logged in as: <b>{user.email}</b></span>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "supported" ? "tab active" : "tab"}
          onClick={() => setActiveTab("supported")}
        >
          Supported Stocks
        </button>

        <button
          className={activeTab === "watchlist" ? "tab active" : "tab"}
          onClick={() => setActiveTab("watchlist")}
        >
          Watchlist
        </button>
      </div>

      {/* CONTENT */}
      <div className="content single">
        {activeTab === "supported" && (
          <div className="panel">
            <h2>Supported Stocks</h2>
            {Object.values(stocks).map(s => (
              <StockCard
                key={s.symbol}
                stock={s}
                subscribed={watchlist.includes(s.symbol)}
                onToggle={toggleSubscribe}
              />
            ))}
          </div>
        )}

        {activeTab === "watchlist" && (
          <div className="panel">
            <Watchlist stocks={stocks} symbols={watchlist} />
          </div>
        )}
      </div>
    </div>
  );
}
