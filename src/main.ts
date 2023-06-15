import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { config as envs } from "dotenv";
envs();

const prisma = new PrismaClient();

interface FungibleTransfer {
    tx: string;
    from: string;
    to: string;
    value: bigint;
}



const iterateTransfers = async (url: string): Promise<string | undefined> => {
    const response = await axios.get(url);
    console.log(`Found ${response.data["data"].length} transfers`)
    for (const entry of response.data["data"]) {
        if (entry.event == 'Transfer(address indexed from, address indexed to, uint256 value)') {
            const transfer: FungibleTransfer = {
                from: entry.result.from,
                to: entry.result.to,
                value: BigInt(entry.result.value),
                tx: entry.transaction_id,
            }
            console.log(`Transferred ${transfer.value} tokens ${transfer.from}->${transfer.to} (${entry.transaction_id})`);
            prisma.transfer.create({
                data: transfer
            }).then(() => {
                console.log("Write to database");
            }).catch((e) => {
                console.error(e);
            });
        }
    }
    return response.data.meta.links.next;
}

const main = async (contract: string) => {
    let nextPage: string | undefined = `${process.env.TRON_API_URL}/contracts/${contract}/events`
    let counter = 0;
    const sleepTime = Number.parseInt(process.env.TIME_SLEEP_SECONDS) * 1000;
    do {
        console.log(`Page counter ${counter++}`);
        nextPage = await iterateTransfers(nextPage);
        await new Promise(f => setTimeout(f, sleepTime));
    }
    while (nextPage !== undefined);
};

main(process.env.CONTRACT_ADDRESS as string).then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    await prisma.$disconnect();
    console.error(e);
});
