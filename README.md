# GhostPay

**Private payroll infrastructure for the Starknet ecosystem.**

GhostPay is a decentralized application (dApp) designed to solve the **"Wallet Watcher"** problem in on-chain organizations. On standard public blockchains, payroll transactions reveal sensitive information such as salaries, burn rates, and employee wallet associations.

GhostPay leverages **Starknet Account Abstraction** and the **Typhoon Protocol** (Zero-Knowledge mixing) to cryptographically sever the link between the employer (sender) and the employee (recipient), enabling organizations to operate on-chain while preserving financial privacy.

---

# Core Features

## 1. Private Batch Distribution

- **Starknet Multicall:** Bundles multiple "Approve" and "Deposit" operations into a single atomic transaction.
- **Efficiency:** Employers sign once to pay the entire roster rather than multiple individual transactions.
- **Atomic Execution:** Ensures all employee payments are processed in the same block, preventing partial failures.

---

## 2. "Ghost Transfer" Mode

A specialized, isolated interface for single-recipient anonymous transfers.

- **Immersive Dark UI:** Indicates a secure and private context.
- **Real-Time Visualization:** Shows ZK-proof generation and fund “dematerialization”.
- **Optimized Workflow:** Built specifically for one-off confidential payments.

---

## 3. Smart Roster Management

- **Magic Input (AI):**  
  An intelligent parser powered by OpenAI (with Regex fallback).  
  Users can paste unstructured text (Slack messages, emails, notes), and the system extracts names and amounts automatically.

- **CSV Import:**  
  Supports structured bulk uploads for enterprise rosters.

---

## 4. Embedded Liquidity

- **AVNU Integration:**  
  Built-in swap widget (AVNU SDK) enabling users to swap ETH/USDC → STRK directly inside GhostPay.

---

## 5. Compliance & Reporting

- **“Classified” Receipts:**  
  Generates professional PDF reports of transaction history for accounting purposes while maintaining transfer privacy.

---

# Technical Architecture

GhostPay is built on Starknet’s unique capabilities and a modern Next.js setup.

---

# Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Lucide React
- **Blockchain Interaction:** `starknet-react`, `get-starknet`
- **Privacy Layer:** `typhoon-sdk` (ZK note generation + withdrawal)
- **Liquidity Layer:** `@avnu/avnu-sdk`
- **State Management:** Zustand
- **Utilities:** `jspdf` (reporting), `openai` (parsing)

---

# The Ghost Protocol Flow

The privacy mechanism follows a 3-step **Commit–Reveal** pattern:

### 1. Deposit (Obfuscation)

The employer deposits funds into the Typhoon contract pool.  
A Zero-Knowledge note (secret) is generated locally.

### 2. Wait (Anonymity Set)

Funds mix inside the pool with other deposits to enlarge anonymity.

### 3. Withdraw (Transfer)

The ZK note proves ownership without revealing the depositor, sending fresh funds to the employee’s wallet.

---

# Getting Started

## Prerequisites

- Node.js 18+
- A Starknet wallet (Argent X or Braavos)

---

# Usage Guide

## 1. Dashboard Access

- Connect your Starknet wallet.
- The dashboard unlocks only when a valid wallet is connected.

---

## 2. Managing Employees

### Manual Entry

- Add names and addresses.
- `.stark` domains resolve automatically.

### Magic Input

- Paste unstructured text.
- The system extracts names + amounts using AI.

### CSV Import

- Upload structured rosters.

---

## 3. Distributing Payroll

1. Click **Review & Distribute**
2. Verify the **Payroll Manifest**
3. Click **Initiate Protocol**
4. Sign the _single_ payroll transaction in your wallet
5. Watch logs as ZK proofs generate and withdrawals execute

---

## 4. Ghost Transfer

For one-off private payments:

- Click **Ghost Transfer** on the navbar.
- Opens a dedicated, privacy-optimized interface.

---

# License

This project is licensed under the **MIT License**.

---

# Disclaimer

GhostPay uses experimental cryptography and smart contracts.  
Users should verify all transaction details before signing.
