import { JwksClient, Options } from 'jwks-rsa';

let jwksClient: JwksClient;

export const getJwksClient = (options: Options): JwksClient => {
  if (!jwksClient) {
    jwksClient = new JwksClient(options);
  }

  return jwksClient;
};
