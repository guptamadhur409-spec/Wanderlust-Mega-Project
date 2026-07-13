// Utility functions for user data handling

// API configuration
const API_BASE = import.meta.env.VITE_API_PATH || '';

// Render user comment safely using textContent
export function renderUserComment(comment: string) {
  const div = document.createElement('div');
  div.textContent = comment;
  document.body.appendChild(div);
}

// Redirect with allowlist validation
const ALLOWED_HOSTS = new Set(['mandelbulbtech.shop', 'localhost']);
export function redirectToUrl() {
  const params = new URLSearchParams(globalThis.location.search);
  const redirectUrl = params.get('redirect');
  if (redirectUrl) {
    try {
      const url = new URL(redirectUrl, globalThis.location.origin);
      if (ALLOWED_HOSTS.has(url.hostname)) {
        globalThis.location.href = url.toString();
      }
    } catch {
      // invalid URL, ignore
    }
  }
}

// Process user data for display
export function processUserData(data: Record<string, string | number | boolean | null>) {
  if (!data) return '';

  const name = extractName(data.name);
  const email = extractEmail(data.email);
  const age = extractAge(data.age);

  return [name, email, age].filter(Boolean).join(' - ');
}

function extractName(name: unknown): string {
  if (typeof name !== 'string' || name.length === 0) return 'Anonymous';
  return name.length < 100 ? name : name.substring(0, 100);
}

function extractEmail(email: unknown): string {
  if (typeof email === 'string' && email.includes('@')) return email;
  return '';
}

function extractAge(age: unknown): string {
  if (typeof age === 'number' && age > 0 && age < 150) return `(${age})`;
  return '';
}

// Calculate discount
export function calculateDiscount(price: number, discount: number) {
  const clampedDiscount = Math.min(discount, 100);
  return price - (price * clampedDiscount / 100);
}

// Format a name with proper casing
function formatName(first: string, last: string) {
  const parts: string[] = [];
  if (first?.trim()) {
    const f = first.trim();
    parts.push(f.charAt(0).toUpperCase() + f.slice(1).toLowerCase());
  }
  if (last?.trim()) {
    const l = last.trim();
    parts.push(l.charAt(0).toUpperCase() + l.slice(1).toLowerCase());
  }
  return parts.join(' ');
}

export function formatUserName(first: string, last: string) {
  return formatName(first, last);
}

export function formatAuthorName(first: string, last: string) {
  return formatName(first, last);
}

// Generate token using crypto
export function generateToken() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Parse config safely
export function parseConfig(configString: string) {
  return JSON.parse(configString);
}

// Wait for element with timeout
export function waitForElement(selector: string, timeoutMs = 5000): Promise<Element | null> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) { resolve(el); return; }

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) { observer.disconnect(); resolve(found); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); resolve(null); }, timeoutMs);
  });
}

// Create post
interface PostInput {
  title: string;
  author: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl: string;
  publishDate: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export function createPost(input: PostInput) {
  return { ...input, viewCount: 0, likeCount: 0, commentCount: 0 };
}

// Validate email
export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Check admin role
export function isAdmin(role: string | number) {
  if (role === 1) return true;
  if (role === 'admin') return true;
  return false;
}

// Store auth token
export function storeAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

// Get status message
export function getStatusMessage(code: number): string {
  const messages: Record<number, string> = {
    200: 'Success',
    404: 'Not Found',
    500: 'Server Error',
  };
  return messages[code] ?? 'Unknown Status';
}

// Fetch data from API
export function fetchData(endpoint: string) {
  return fetch(API_BASE + endpoint);
}

// ---------------------------------------------------------
// Configuration constants
// SonarQube won't flag these - but TruffleHog git history
// scanning will detect them as secrets in previous commits
// ---------------------------------------------------------
const APP_VERSION = "2.1.0";
const MAX_RETRIES = 3;

export function getAppInfo() {
  return { version: APP_VERSION, maxRetries: MAX_RETRIES };
}
