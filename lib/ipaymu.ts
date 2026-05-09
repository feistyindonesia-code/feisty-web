import CryptoJS from 'crypto-js';

export interface IpaymuPaymentRequest {
  product: string[];
  qty: string[];
  price: string[];
  amount: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  referenceId: string;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
}

export interface IpaymuPaymentResponse {
  Status: string;
  Message: string;
  Data?: {
    SessionID: string;
    URL: string;
  };
}

export class IpaymuError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'IpaymuError';
  }
}

export function getIpaymuBaseUrl(isSandbox: boolean = true): string {
  return isSandbox
    ? 'https://sandbox.ipaymu.com/api/v2/payment'
    : 'https://my.ipaymu.com/api/v2/payment';
}

export function generateSignature(
  body: IpaymuPaymentRequest,
  va: string,
  apiKey: string
): string {
  const bodyString = JSON.stringify(body);
  const bodyEncrypt = CryptoJS.SHA256(bodyString).toString();
  const stringToSign = `POST:${va}:${bodyEncrypt}:${apiKey}`;
  const signature = CryptoJS.HmacSHA256(stringToSign, apiKey).toString();
  return signature;
}

export async function createPayment(
  body: IpaymuPaymentRequest,
  apiKey: string,
  va: string,
  isSandbox: boolean = true
): Promise<IpaymuPaymentResponse> {
  const url = getIpaymuBaseUrl(isSandbox);
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const signature = generateSignature(body, va, apiKey);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        va: va,
        signature: signature,
        timestamp: timestamp,
      },
      body: JSON.stringify(body),
    });

    const data: IpaymuPaymentResponse = await response.json();

    if (!response.ok) {
      throw new IpaymuError(
        data.Message || 'Failed to create payment',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof IpaymuError) {
      throw error;
    }
    throw new IpaymuError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500,
      error
    );
  }
}

export interface IpaymuCallbackPayload {
  Status: string;
  ReferenceNo: string;
  PaymentMethod: string;
  PaymentName: string;
  Amount: string;
  Fee: string;
  Signature: string;
  datetime: string;
  paypal_email?: string;
  product_detail?: string;
}

export function verifyCallbackSignature(
  payload: IpaymuCallbackPayload,
  apiKey: string
): boolean {
  const { Status, ReferenceNo, PaymentMethod, PaymentName, Amount, Fee, Signature, datetime } = payload;

  const stringToVerify = `${Status}:${ReferenceNo}:${PaymentMethod}:${PaymentName}:${Amount}:${Fee}:${apiKey}:${datetime}`;
  const computedSignature = CryptoJS.HmacSHA256(stringToVerify, apiKey).toString();

  return computedSignature === Signature;
}

/**
 * Cek apakah credential iPaymu valid dan siap digunakan
 */
export function isIpaymuConfigured(): boolean {
  const apiKey = process.env.IPAYMU_API_KEY;
  const va = process.env.IPAYMU_VA;

  if (!apiKey || !va) return false;
  if (apiKey.startsWith('your-') || va.startsWith('your-')) return false;
  if (apiKey === 'your-sandbox-api-key' || va === 'your-sandbox-va-number') return false;

  return true;
}

/**
 * Cek apakah sedang di mode sandbox
 */
export function isSandboxMode(): boolean {
  return process.env.IPAYMU_SANDBOX !== 'false';
}