import { Send, Upload } from "lucide-react";
import { products, text } from "@/lib/site-data";

export function InquiryForm({ compact = false }: { compact?: boolean }) {
  return (
    <form id="inquiry-form" className={compact ? "inquiry-form compact" : "inquiry-form"} action="/api/inquiry" method="post">
      <div className="form-grid">
        <label>
          Name
          <input name="name" required placeholder="Your name" />
        </label>
        <label>
          Company
          <input name="company" required placeholder="Company name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required placeholder="name@company.com" />
        </label>
        <label>
          Phone / WhatsApp
          <input name="phone" placeholder="+1 000 000 0000" />
        </label>
        <label>
          Country
          <input name="country" placeholder="Destination market" />
        </label>
        <label>
          Product Interest
          <select name="product">
            {products.map((product) => (
              <option key={product.slug}>{text(product.name)}</option>
            ))}
            <option>Custom drawing-based profile</option>
          </select>
        </label>
      </div>
      <label>
        Quantity / Annual Demand
        <input name="quantity" placeholder="Example: 10,000 sets per order" />
      </label>
      <label>
        Message
        <textarea name="message" rows={compact ? 4 : 6} placeholder="Share dimensions, surface finish, drawing details, delivery market, and expected schedule." />
      </label>
      <div className="upload-note">
        <Upload size={18} />
        Drawing upload will be connected during backend integration. For now, mention drawing details in the message.
      </div>
      <button type="submit" className="primary-button">
        Send Inquiry <Send size={18} />
      </button>
    </form>
  );
}
