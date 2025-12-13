export default function SubscribedTable({ subs }) {
  return (
    <div>
      <h3>Your Watchlist</h3>

      {subs.map(s => (
        <div key={s.symbol} className="stock-card">
          <div className="stock-left">
            <img
              src={`/logos/${s.symbol}.png`}
              alt={s.symbol}
              className="stock-logo"
            />
            <strong>{s.symbol}</strong>
          </div>

          <div className="price">{s.price}</div>
        </div>
      ))}
    </div>
  );
}
