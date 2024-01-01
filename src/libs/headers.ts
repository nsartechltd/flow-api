import config from '../config';

export const headers = (override = {}) => ({
  'Access-Control-Allow-Origin': config.cors,
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
  ...override,
});
