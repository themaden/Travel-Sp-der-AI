import { ethers } from "ethers";
import { agentWallet, VAULT_ABI } from "../config/blockchain.js";
import { MockFlightService } from "../services/FlightService.js";

export class SniperAgent {
    private vaultContract: ethers.Contract;
    private flightService: MockFlightService;

    // Kontrat adresi dışarıdan verilir (Dependency Injection)
    constructor(vaultAddress: string) {
        this.vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, agentWallet);
        this.flightService = new MockFlightService();
    }

    async runPatrol() {
        console.log("🕵️‍♂️ Sniper Agent scanning for flights...");

        // 1. Uçuş Ara (Service Katmanı)
        const ticket = await this.flightService.findTicket();
        console.log(`🎫 Ticket Found: ${ticket.destination} for ${ticket.price} WEI`);

        // 2. Kasa Bakiyesini Kontrol Et (Blockchain Katmanı)
        // Provider'dan balance alıyoruz çünkü kontratımızda getBalance yok
        const balance = await this.vaultContract.runner!.provider!.getBalance(this.vaultContract.target);
        console.log(`💰 Vault Balance: ${balance.toString()} WEI`);

        if (balance < BigInt(ticket.price)) {
            console.error("❌ Insufficient funds in Vault! Aborting.");
            return;
        }

        // 3. Tetik Çekiliyor (Execute Purchase)
        // Gerçek hayatta havayolu cüzdan adresi API'den gelir, şimdilik rastgele bir adres.
        const airlineWallet = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

        try {
            console.log("🚀 Executing x402 Payment...");
            const tx = await (this.vaultContract as any).executePurchase(
                airlineWallet,
                ticket.price,
                ticket.id
            );
            console.log(`⏳ Transaction sent! Hash: ${tx.hash}`);

            // İşlemin onaylanmasını bekle
            await tx.wait();
            console.log("✅ Purchase Confirmed on Cronos Chain!");

        } catch (error) {
            console.error("🔥 Transaction Failed:", error);
        }
    }
}