import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Hata yönetimi için basit bir kontrol
if (!process.env.AGENT_PRIVATE_KEY || !process.env.RPC_URL) {
    throw new Error("Missing .env variables (AGENT_PRIVATE_KEY or RPC_URL)");
}

// 1. Provider (Hattı kurar)
export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// 2. Wallet (İmzayı atacak olan Ajan)
export const agentWallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);

// 3. Kontrat ABI (Foundry build klasöründen otomatik alınabilir ama şimdilik manuel basit veriyoruz)
// Not: Gerçek projede bunu "out/TravelVault.sol/TravelVault.json" dosyasından okuruz.
export const VAULT_ABI = [
    "function executePurchase(address payable _destination, uint256 _cost, string _flightId) external"
];

console.log(`✅ Blockchain connection established. Agent: ${agentWallet.address}`);