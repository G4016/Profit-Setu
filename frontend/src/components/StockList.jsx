export default function StockList({ stocks, subs, onSubscribe }) {
  const subscribed = subs.map(s => s.symbol);

  return (
    <div>
      <h3>Supported Stocks</h3>

      {stocks.map(s => (
        <div key={s.symbol} className="stock-card">
          <div className="stock-left">
            <img
              src={`/logos/${s.symbol}.png`}
              alt={s.symbol}
              className="stock-logo"
            />
            <div>
              <strong>{s.symbol}</strong>
              <div className="price">{s.price}</div>
            </div>
          </div>

          <button
            disabled={subscribed.includes(s.symbol)}
            onClick={() => onSubscribe(s.symbol)}
            className={subscribed.includes(s.symbol) ? "subscribed" : ""}
          >
            {subscribed.includes(s.symbol) ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      ))}
    </div>
  );
}
