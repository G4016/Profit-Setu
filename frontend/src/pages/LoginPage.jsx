import { useState } from "react";

const API = "http://localhost:4000/api";

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const submit = async () => {
  try {
    const res = await fetch(`${API}/${isSignup ? "signup" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("Auth response:", data);

    if (!res.ok) {
  if (isSignup && res.status === 409) {
    alert("Account already exists. Please login.");
  } else if (!isSignup && res.status === 401) {
    alert("Invalid email or password.");
  } else {
    alert(data.message || "Something went wrong.");
  }
  return;
}


    onLogin(data);

  } catch (err) {
    console.error("Frontend auth error:", err);
    alert("Cannot connect to backend");
  }
};

const isDisabled =
  !email || !password || (isSignup && password.length < 6);

<button disabled={isDisabled} onClick={submit}>
  {isSignup ? "Sign Up" : "Login"}
</button>


return (
  <div className="login-container">
    <div className="login-box">
      <img
        src="/logos/stock_logo.png"
        alt="ProfitSetu Logo"
        className="app-logo"
      />

      <h1 className="app-title">ProfitSetu</h1>
      <p className="tagline">Smart Analytics for Smarter Investments</p>

      <h3>{isSignup ? "Sign Up" : "Login"}</h3>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="min 6 chars"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={submit}>
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <p
  className="switch"
  onClick={() => {
    setIsSignup(!isSignup);
    setEmail("");
    setPassword("");
  }}
>
  {isSignup
    ? "Already have an account? Login"
    : "New user? Create an account"}
</p>

    </div>
  </div>
);

}
