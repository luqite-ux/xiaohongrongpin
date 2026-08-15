"use client";

import { useState, type FormEvent } from "react";
import { Send, Upload } from "lucide-react";
import { products as fallbackProducts, text, type Product } from "@/lib/site-data";

export function InquiryForm({ compact = false, products = fallbackProducts, defaultProduct }: { compact?: boolean; products?: Product[]; defaultProduct?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setMessage("");
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    });
    const result = await response.json().catch(() => ({ message: "The inquiry endpoint returned an unexpected response." }));
    if (!response.ok) {
      setStatus("error");
      setMessage(result.message || "Please check the required fields and try again.");
      return;
    }
    form.reset();
    setStatus("success");
    setMessage(result.message || "Inquiry received. The team will review your project details.");
  }

  return (
    <form id="inquiry-form" className={compact ? "inquiry-form compact" : "inquiry-form"} onSubmit={submit}>
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
          <select name="product" defaultValue={defaultProduct}>
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
        If drawings are required, mention dimensions and file details in the message so the team can follow up.
      </div>
      {message ? <p className={status === "error" ? "form-message error" : "form-message"}>{message}</p> : null}
      <button type="submit" className="primary-button" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Inquiry"} <Send size={18} />
      </button>
    </form>
  );
}
