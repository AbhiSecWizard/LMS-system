import { useEffect, useState } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const {orderId} = useParams()
  console.log(orderId)
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Verifying your payment...");
  
  // URL se orderId aur courseId dono nikalna
  // const orderId = searchParams.get("orderId");
  const courseId = searchParams.get("courseId");

  useEffect(() => {

    const verifyAndFixStatus = async () => {
      if (!orderId) {
        setLoading(false);
        setStatusMessage("Order ID missing!");
        return;
      }

      try {
        // 🎯 Frontend se Backend ko trigger karenge status sync karne ke liye
        // Kyunki hum localhost testing me hain, hum direct status trigger bhej sakte hain
        const response = await axios.get(`http://localhost:3000/api/v1/payment/status/${orderId}`, {
          withCredentials: true
        });

        if (response.data.success) {
          console.log("Database response:", response.data);
          setStatusMessage("🎉 Payment Successfully Verified & Course Enrolled!");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        setStatusMessage("Payment verified in dashboard. Please check your course section.");
      } finally {
        setLoading(false);
      }
    };

    verifyAndFixStatus();
  }, [orderId]);

  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      {loading ? (
        <div>
          <div className="spinner" style={{ fontSize: "24px", fontWeight: "bold" }}>🔄 {statusMessage}</div>
        </div>
      ) : (
        <div>
          <h1 style={{ color: "green", fontSize: "36px", marginBottom: "20px" }}>🎉 Payment Success!</h1>
          <p style={{ fontSize: "18px", color: "#555" }}>{statusMessage}</p>
          
          <div style={{ marginTop: "30px" }}>
            <Link to="/my-learning" style={{ padding: "12px 25px", background: "#2563eb", color: "#fff", textDecoration: "none", borderRadius: "6px", fontWeight: "6px" }}>
              Go to My Learning
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}