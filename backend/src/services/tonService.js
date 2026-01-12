const { Address, TonClient, WalletContractV4, internal } = require('@ton/ton');
const { mnemonicToPrivateKey } = require('@ton/crypto');

class TonService {
  constructor() {
    this.network = process.env.TON_NETWORK || 'testnet';
    this.endpoint = process.env.TON_RPC_URL || 'https://testnet.toncenter.com/api/v2/jsonRPC';
    this.walletAddress = process.env.WALLET_ADDRESS;
    this.client = null;
    this.wallet = null;
  }

  async initialize() {
    try {
      // Inicializa o cliente TON
      this.client = new TonClient({
        endpoint: this.endpoint
      });

      // Converte mnemonic para chave privada
      const mnemonic = process.env.WALLET_SEED.split(' ');
      const keyPair = await mnemonicToPrivateKey(mnemonic);

      // Cria a wallet
      this.wallet = WalletContractV4.create({
        workchain: 0,
        publicKey: keyPair.publicKey
      });

      console.log('✅ TON Service initialized');
      console.log(`🌐 Network: ${this.network}`);
      console.log(`💼 Wallet: ${this.walletAddress}`);

      return true;
    } catch (error) {
      console.error('❌ Error initializing TON Service:', error);
      return false;
    }
  }

  async verifyTransaction(txHash) {
    try {
      const transactions = await this.client.getTransactions(
        Address.parse(this.walletAddress),
        { limit: 20 }
      );

      const tx = transactions.find(t => t.hash().toString('hex') === txHash);

      if (tx) {
        return {
          confirmed: true,
          amount: this.parseAmount(tx),
          from: tx.inMessage?.info?.src?.toString() || 'unknown'
        };
      }

      return { confirmed: false };
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return { confirmed: false, error: error.message };
    }
  }

  async sendTon(toAddress, amount, comment = '') {
    try {
      if (!this.wallet) {
        await this.initialize();
      }

      const mnemonic = process.env.WALLET_SEED.split(' ');
      const keyPair = await mnemonicToPrivateKey(mnemonic);

      const walletContract = this.client.open(this.wallet);
      const seqno = await walletContract.getSeqno();

      await walletContract.sendTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [
          internal({
            to: toAddress,
            value: this.toNano(amount),
            body: comment,
            bounce: false
          })
        ]
      });

      console.log(`✅ Sent ${amount} TON to ${toAddress}`);
      return { success: true, amount, to: toAddress };
    } catch (error) {
      console.error('Error sending TON:', error);
      return { success: false, error: error.message };
    }
  }

  toNano(amount) {
    return BigInt(Math.floor(amount * 1e9));
  }

  fromNano(nano) {
    return Number(nano) / 1e9;
  }

  parseAmount(tx) {
    if (tx.inMessage?.info?.value?.coins) {
      return this.fromNano(tx.inMessage.info.value.coins);
    }
    return 0;
  }

  async getBalance(address = null) {
    try {
      const addr = address || this.walletAddress;
      const balance = await this.client.getBalance(Address.parse(addr));
      return this.fromNano(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }
}

module.exports = new TonService();