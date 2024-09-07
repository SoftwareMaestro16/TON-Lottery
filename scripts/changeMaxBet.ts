import { toNano, Address } from '@ton/core';
import { Main, MainConfig } from '../wrappers/Main';
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

        await main.sendChangeMaxBet(provider.sender(), toNano("0.02"), toNano("0.65"));
        await provider.waitForDeploy(main.address);

        console.log('Change owner request sent');
    } catch (error) {
        console.error('Failed to change owner:', error);
    }
}