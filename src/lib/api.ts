export interface OrderData {
  nom: string;
  gouvernerat: string;
  ville: string;
  adresse: string;
  cp: string;
  tel: string;
  tel2?: string;
  designation: string;
  nb_article: number;
  msg: string;
  prix?: string;
  echange?: number; // 0 or 1
  article?: string;
  nb_echange?: number;
  ouvrir?: number; // 0 or 1
}

export interface OrderResponse {
  status: number;
  lien?: string;
  code_tracking?: string; // e.g. "xxxxxx6427501"
  code_barre2?: string;
  status_message?: string;
}

export interface TrackingResponse {
  status: number;
  etat: string;
  motif: string | null;
  status_message: string;
}

const ADD_ORDER_Token = process.env.NEXT_PUBLIC_TRUST_ADD_TOKEN || "";
if (!ADD_ORDER_Token) {
  throw new Error("NEXT_PUBLIC_TRUST_ADD_TOKEN is not defined in environment variables");
}

export const GOVERNORATES = [
  "Ariana", "Beja", "Ben Arous", "Bizerte", "Gabes", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kebili", "LE Kef", "Mahdia", "Mannouba",
  "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana",
  "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
];

export async function createOrder(data: OrderData): Promise<OrderResponse> {
  const formData = new FormData();
  formData.append("token", ADD_ORDER_Token);

  // Append all fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  try {
    const response = await fetch("https://app.trustdelivery.com.tn/api/v1/post.php", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Order creation failed:", error);
    return { status: 0, status_message: "Network or Server Error" };
  }
}

// Placeholder for tracking
// The URL is not confirmed. Assuming a standard pattern or waiting for user input.
