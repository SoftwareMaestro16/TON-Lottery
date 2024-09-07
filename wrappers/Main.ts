import { Address, beginCell, Cell, Contract, contractAddress, toNano, ContractProvider, Sender, SendMode } from '@ton/core';

export type MainConfig = {
    owner: Address;
    minChance: bigint;
    maxChance: bigint;
    minBet: bigint;
    maxBet: bigint;
};

export function mainConfigToCell(config: MainConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeUint(config.minChance, 64)
        .storeUint(config.maxChance, 64)
        .storeUint(config.minBet, 64)
        .storeUint(config.maxBet, 64)
        .storeUint(0, 32)
    .endCell();
}

export class Main implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Main(address);
    }

    static createFromConfig(config: MainConfig, code: Cell, workchain = 0) {
        const data = mainConfigToCell(config);
        const init = { code, data };
        return new Main(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendLotteryMin(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x3202715d, 32)
            .endCell(),
        });
    }

    async sendLotteryMax(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xe0f4e04, 32)
            .endCell(),
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xb5de5f9e, 32)
            .endCell(),
        });
    }

    async sendChangeOwner(provider: ContractProvider, via: Sender, value: bigint, newOwner: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x93b05b31, 32)
                .storeAddress(newOwner)
            .endCell(),
        });
    }

    async sendChangeRandomNumbers(provider: ContractProvider, via: Sender, value: bigint, minChance: bigint, maxChance: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x71247654, 32)
                .storeUint(minChance, 64)
                .storeUint(maxChance, 64)
            .endCell(),
        });
    }

    async sendChangeMinBet(provider: ContractProvider, via: Sender, value: bigint, minBet: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x192ced31, 32)
                .storeUint(minBet, 64)
            .endCell(),
        });
    }

    async sendChangeMaxBet(provider: ContractProvider, via: Sender, value: bigint, maxBet: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x1adf0d7e, 32)
                .storeUint(maxBet, 64)
            .endCell(),
        });
    }

    async sendLock(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano("0.02"),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x878f9b0e, 32)
            .endCell(),
        });
    }

    async sendUnlock(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano("0.02"),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x6ae4b0ef, 32)
            .endCell(),
        });
    }

    async getOwner(provider: ContractProvider): Promise<Address> {
        const res = (await provider.get('get_owner', [])).stack;
        return res.readAddress();
    }

    async getIsLocked(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_is_locked', [])).stack;
        return res.readNumber();
    }

    async getMaxChance(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_max_chance', [])).stack;
        return res.readNumber();
    }

    async getMinChance(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_min_chance', [])).stack;
        return res.readNumber();
    }

    async getMaxBet(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_max_bet', [])).stack;
        return res.readNumber();
    }

    async getMinBet(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_min_bet', [])).stack;
        return res.readNumber();
    }
}
