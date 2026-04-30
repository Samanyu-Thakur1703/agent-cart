import Database from 'better-sqlite3';

const db = new Database('agent-cart.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    reasoning TEXT,
    receipt_id TEXT,
    tx_hash TEXT,
    session_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS spending_policy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    max_per_transaction REAL DEFAULT 100,
    max_per_day REAL DEFAULT 500,
    current_day_spend REAL DEFAULT 0,
    last_reset_date TEXT DEFAULT CURRENT_DATE
  );

  INSERT OR IGNORE INTO spending_policy (id) VALUES (1);
`);

export interface Purchase {
  id: number;
  product_name: string;
  price: number;
  reasoning?: string;
  receipt_id?: string;
  tx_hash?: string;
  session_id?: string;
  timestamp: string;
}

export interface SpendingPolicy {
  max_per_transaction: number;
  max_per_day: number;
  current_day_spend: number;
  last_reset_date: string;
}

export function addPurchase(purchase: Omit<Purchase, 'id' | 'timestamp'>): Purchase {
  const stmt = db.prepare(`
    INSERT INTO purchases (product_name, price, reasoning, receipt_id, tx_hash, session_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    purchase.product_name,
    purchase.price,
    purchase.reasoning || null,
    purchase.receipt_id || null,
    purchase.tx_hash || null,
    purchase.session_id || null
  );

  return getPurchaseById(result.lastInsertRowid as number)!;
}

export function getPurchaseById(id: number): Purchase | undefined {
  const stmt = db.prepare('SELECT * FROM purchases WHERE id = ?');
  return stmt.get(id) as Purchase | undefined;
}

export function getAllPurchases(): Purchase[] {
  const stmt = db.prepare('SELECT * FROM purchases ORDER BY timestamp DESC');
  return stmt.all() as Purchase[];
}

export function getSpendingPolicy(): SpendingPolicy {
  const stmt = db.prepare('SELECT * FROM spending_policy WHERE id = 1');
  return stmt.get() as SpendingPolicy;
}

export function updateSpendingPolicy(updates: Partial<SpendingPolicy>): SpendingPolicy {
  const sets = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');
  const values = Object.values(updates);

  const stmt = db.prepare(`UPDATE spending_policy SET ${sets} WHERE id = 1`);
  stmt.run(...values);

  return getSpendingPolicy();
}

export function addToDaySpend(amount: number): SpendingPolicy {
  const policy = getSpendingPolicy();

  // Reset if new day
  const today = new Date().toISOString().split('T')[0];
  if (policy.last_reset_date !== today) {
    return updateSpendingPolicy({
      current_day_spend: amount,
      last_reset_date: today,
    });
  }

  return updateSpendingPolicy({
    current_day_spend: policy.current_day_spend + amount,
  });
}

export function checkSpendingLimit(productPrice: number): { allowed: boolean; reason?: string } {
  const policy = getSpendingPolicy();

  if (productPrice > policy.max_per_transaction) {
    return {
      allowed: false,
      reason: `Product price $${productPrice} exceeds transaction limit of $${policy.max_per_transaction}`,
    };
  }

  const today = new Date().toISOString().split('T')[0];
  let currentSpend = policy.current_day_spend;

  if (policy.last_reset_date !== today) {
    currentSpend = 0;
  }

  if (currentSpend + productPrice > policy.max_per_day) {
    return {
      allowed: false,
      reason: `This purchase would exceed daily limit of $${policy.max_per_day} (spent $${currentSpend} today)`,
    };
  }

  return { allowed: true };
}
