import { toNano, Address } from '@ton/core';
import { Main } from '../wrappers/Main';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    try {
        const main = provider.open(Main.createFromConfig({
            owner: provider.sender().address as Address,
            minChance: 100000000n,
            maxChance: 1000000000n,
            minBet: toNano("0.25"),
            maxBet: toNano("0.50"),
        }, await compile('Main')));

        await main.sendLock(provider.sender());
        await provider.waitForDeploy(main.address);

        console.log('Change owner request sent');
    } catch (error) {
        console.error('Failed to change owner:', error);
    }
}