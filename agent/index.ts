import * as dotenv from "dotenv";
import { SniperAgent } from "./core/SniperAgent.js";

dotenv.config();

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!contractAddress) {
        console.error("⚠️ Please set CONTRACT_ADDRESS in .env file after deployment.");
        process.exit(1);
    }

    const bot = new SniperAgent(contractAddress);
    
    // Botu tek seferlik çalıştır (İstersen setInterval ile döngüye alabilirsin)
    await bot.runPatrol();
}

main().catch(console.error);