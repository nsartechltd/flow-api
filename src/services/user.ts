import { PostConfirmationTriggerEvent } from 'aws-lambda';

export const storeUser = (event: PostConfirmationTriggerEvent) => {
  console.log('Event received: ', event);

  const { userAttributes: attributes } = event.request;

  console.log('User attributes: ', attributes);

  return event;
};
