import nats, { Stan } from 'node-nats-streaming';

// SINGLETON CLASS

class NatsWrapper {
  private _client?: Stan;

  // getter - defines the client property on the instance
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS!')
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      })
    })
  }
}

// exporting one single instance
// and sharing among all files in project
export const natsWrapper = new NatsWrapper();