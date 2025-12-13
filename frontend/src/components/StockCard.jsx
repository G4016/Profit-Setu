export default function StockCard({ stock, subscribed, onToggle }) {
  return (
    <div className="stock-row simple">
      <div className="stock-meta">
        <img src={`/logos/${stock.symbol}.png`} alt={stock.symbol} />
        <div className="ticker">{stock.symbol}</div>
      </div>

      <button
        className={subscribed ? "subscribed" : ""}
        onClick={() => onToggle(stock.symbol)}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}
