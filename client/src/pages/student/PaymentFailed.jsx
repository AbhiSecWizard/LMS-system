import { Link } from "react-router-dom";

export default function PaymentFailed() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ color: "red" }}>❌ Payment Failed</h1>
      <p>Kisi wajah se aapka transaction pura nahi ho paya. Kripya dobara koshish karein.</p>
      <div style={{ margin: "20px 0" }}>
        <Link to="/" style={{ padding: "10px 20px", background: "#333", color: "#fff", textDecoration: "none", borderRadius: "5px" }}>
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}
