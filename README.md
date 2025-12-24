# GhostPay v2

**Private payroll infrastructure for the Starknet ecosystem.**

GhostPay is a decentralized application (dApp) designed to solve the **“Wallet Watcher”** problem in on-chain organizations. On standard public blockchains, payroll transactions reveal sensitive information such as salaries, burn rates, and employee wallet associations.

GhostPay v2 leverages **Starknet Account Abstraction** and **Tongo Cash**—a confidential payment protocol based on homomorphic encryption—to cryptographically sever the link between the employer (sender) and the employee (recipient).

Unlike simple mixers, GhostPay enables organizations to hold **persistent encrypted balances**, ensuring true financial confidentiality for treasury operations.

---

## Core Features

### 1. The Ghost Vault (Confidential Treasury)

- **Persistent Privacy**  
  Unlike mixers where funds must be withdrawn immediately to break a link, GhostPay allows encrypted assets (`tSTRK`) to be held indefinitely.

- **Homomorphic Encryption**  
  The blockchain performs arithmetic on encrypted balances (Deposits − Payroll) without ever revealing actual amounts.

- **Wrap & Unwrap**  
  Seamlessly convert public assets (STRK / ETH) into private treasury funds via the **Tongo Protocol**.

---

### 2. Private Batch Distribution

- **Starknet Multicall**  
  Bundles multiple private withdrawal operations into a single atomic transaction.

- **Efficiency**  
  Employers sign once to pay an entire roster of 50+ employees using ZK proofs generated locally.

- **Atomic Execution**  
  Ensures all employee payments are processed in the same block, preventing partial failures.

---

### 3. Instant Pay

A specialized interface for one-off payments to vendors, freelancers, or bounty hunters outside a formal roster.

- **Dual Mode**  
  Pay from either your **Public Wallet** or **Ghost Vault**.

- **Payment Vouchers**  
  Automatically generates a PDF receipt for every instant payment for compliant bookkeeping.

- **No Setup**  
  Paste a wallet address and send.

---

### 4. Multi-Organization Management

- **Command Center**  
  A unified dashboard to manage multiple DAOs, startups, or projects from a single wallet.

- **Context Switching**  
  Toggle between different organization rosters and histories without reconnecting.

---

### 5. Smart Roster Management

- **Magic Input (AI)**  
  Intelligent parser powered by OpenAI. Paste unstructured text (Slack messages, emails), and the system extracts names and amounts automatically.

- **CSV Import**  
  Supports structured bulk uploads for enterprise rosters.

---

### 6. Compliance & Reporting

- **“Classified” Receipts**  
  Generates professional PDF transaction reports for accounting purposes.

- **Selective Disclosure**  
  Uses Tongo view keys (roadmap) and signed reports to prove payments to auditors without exposing full private histories.

---

## Technical Architecture

GhostPay is built on Starknet’s unique capabilities and a modern **Next.js** setup.

### Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Lucide React
- **Blockchain Interaction:** starknet-react, get-starknet
- **Privacy Layer:** `@fatsolutions/tongo-sdk` (ElGamal Encryption & ZK Proofs)
- **Liquidity Layer:** `@avnu/avnu-sdk`
- **State Management:** Zustand
- **Utilities:** jspdf (reporting), openai (parsing)

---

## The Ghost Protocol Flow (Powered by Tongo)

The privacy mechanism evolves beyond mixers into a **Confidential Treasury**.

### 1. Initialize Identity

The user signs a message to deterministically derive their **Tongo Keys**, creating an encrypted on-chain identity linked to their Starknet wallet.

---

### 2. Wrap (Fund)

The employer deposits public tokens (STRK) into the Tongo contract.  
The contract mints an equivalent amount of encrypted tokens (`tSTRK`) to the employer’s Tongo account.

> The link between deposit and balance is obfuscated.

---

### 3. Private Payroll (Withdraw to Other)

The employer pays employees using private `tSTRK`.

- A Zero-Knowledge proof authorizes the withdrawal.
- The employee receives **public STRK**.

**On-chain view:**  
Funds originate from the Tongo Pool — the employer’s wallet is not linked.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Starknet wallet (Argent X or Braavos)

---

## Usage Guide

### 1. Command Center

- Connect your Starknet wallet.
- View **Global Liability** (total payroll) and **Liquidity** (public vs private balances).
- Select an organization to manage.

---

### 2. Treasury Management

- Navigate to the **Treasury** tab.
- **Wrap:** Public Wallet → Ghost Vault.
- **Swap:** Use the embedded AVNU widget to exchange ETH/USDC for STRK.

---

### 3. Distributing Payroll

- Select an organization.
- Click **Review & Distribute**.
- Choose source:
  - Public Wallet (visible)
  - Ghost Vault (private)
- Verify the payroll manifest.
- Click **Initiate Protocol** and sign the batch transaction.

---

### 4. Instant Pay

For ad-hoc payments:

- Click **Instant Pay** in the header.
- Enter recipient name, service description, and address.
- Select **Ghost Vault** for privacy.
- Send and download the generated **Payment Voucher**.

---

## License

This project is licensed under the **MIT License**.

---

## Disclaimer

GhostPay uses experimental cryptography and smart contracts.  
While the Tongo Protocol is designed for privacy, users should exercise caution and verify all transaction details before signing.
