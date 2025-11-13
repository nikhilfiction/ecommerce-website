import { useSelector } from "react-redux";
import { useState } from "react";
import API from "../api";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51SFdiC3aM0XlrXV6c5K5lWiuqZD01Hg10ruyiglWGBB03WbbFiyEKB85CsYf7VdcxDFKsR8wVjFJjlbd6CE036aL00k0SNwqLB");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#374151", // tailwind gray-700
      fontSize: "16px",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#9ca3af", // tailwind gray-400
      },
      padding: "12px",
    },
    invalid: {
      color: "#dc2626", // tailwind red-600
      iconColor: "#dc2626",
    },
  },
};

function CombinedCheckoutForm({ items, total, token }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleCombinedCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Create Stripe payment intent
      const paymentRes = await API.post("/payment/create-payment-intent", {
        amount: total
      });
      const clientSecret = paymentRes.data.clientSecret;

      // Step 2: Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setLoading(false);
        alert(result.error.message);
        return;
      }
      if (result.paymentIntent.status === "succeeded") {
        // Step 3: Place order in backend
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await API.post(
          "/orders",
          {
            items,
            shippingAddress: { name, address, city, postalCode, phone },
            totalPrice: total
          },
          config
        );
        setLoading(false);
        alert("Payment & Order placed successfully!");
      }
    } catch (err) {
      setLoading(false);
      alert("Order failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleCombinedCheckout}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        type="text"
        className="block w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-blue-500 transition"
        placeholder="Full Name"
        required
      />
      <input
        value={address}
        onChange={e => setAddress(e.target.value)}
        type="text"
        className="block w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-blue-500 transition"
        placeholder="Address"
        required
      />
      <input
        value={city}
        onChange={e => setCity(e.target.value)}
        type="text"
        className="block w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-blue-500 transition"
        placeholder="City"
        required
      />
      <input
        value={postalCode}
        onChange={e => setPostalCode(e.target.value)}
        type="text"
        className="block w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-blue-500 transition"
        placeholder="Postal Code"
        required
      />
      <input
        value={phone}
        onChange={e => setPhone(e.target.value)}
        type="tel"
        className="block w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-blue-500 transition"
        placeholder="Phone Number"
        required
      />
      <div className="border-2 border-gray-300 rounded-lg p-3 mb-4 focus-within:border-blue-500 transition">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <button
        disabled={!stripe || loading}
        className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg mt-2 disabled:bg-gray-400"
        type="submit"
      >
        {loading ? "Processing..." : `Pay & Place Order ($${total})`}
      </button>
    </form>
  );
}

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);
  const total = items.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0
  );
  const { token } = useSelector((state) => state.auth);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      <h3 className="text-lg font-bold mb-2">Order Summary</h3>
      <ul className="mb-6">
        {items.map((item) => (
          <li key={item.product._id} className="mb-2">
            {item.product.title} × {item.quantity} — ${item.product.price * item.quantity}
          </li>
        ))}
      </ul>
      <div className="mb-6 font-bold">Total: ${total.toFixed(2)}</div>

      <Elements stripe={stripePromise}>
        <CombinedCheckoutForm items={items} total={total} token={token} />
      </Elements>
    </div>
  );
};

export default Checkout;
