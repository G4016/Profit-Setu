export default function Watchlist({ stocks, symbols }) {
  return (
    <>
      <h2>Your Watchlist</h2>

      {symbols.map(sym => {
        const s = stocks[sym];
        if (!s) return null;

        const up = s.current >= s.prev;
        const color = up ? "#22c55e" : "#ef4444";

        const min = Math.min(...s.prices);
        const max = Math.max(...s.prices);

        const points = s.prices
          .map((p, i) => {
            const x = i * 8;
            const y = 40 - ((p - min) / (max - min || 1)) * 30;
            return `${x},${y}`;
          })
          .join(" ");

        return (
          <div key={sym} className="watch-card detailed">
            <div className="watch-left">
              <img src={`/logos/${sym}.png`} alt={sym} />
              <div>
                <strong>{sym}</strong>
                <div className={up ? "up" : "down"}>
                  {s.current.toFixed(2)}
                </div>
              </div>
            </div>

            <svg width="180" height="50">
              <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
              />
            </svg>
          </div>
        );
      })}

      <table className="watch-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {symbols.map(sym => {
            const s = stocks[sym];
            if (!s) return null;
            const up = s.current >= s.prev;

            return (
              <tr key={sym}>
                <td>{sym}</td>
                <td>{s.current.toFixed(2)}</td>
                <td className={up ? "up" : "down"}>
                  {up ? "Up" : "Down"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
