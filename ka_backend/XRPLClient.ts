import * as xrpl from 'xrpl';

export class XRPLClient {
  public client: xrpl.Client;

  constructor() {
    this.client = new xrpl.Client("wss://s.devnet.rippletest.net:51233");
  }

  async connect() {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
  }

  async disconnect() {
    if (this.client.isConnected()) {
      await this.client.disconnect();
    }
  }
}