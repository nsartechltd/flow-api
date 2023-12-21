import { Handler, PostConfirmationTriggerEvent } from 'aws-lambda';

import { storeUser } from '../services/user';

export const storeHandler: Handler = async (
  event: PostConfirmationTriggerEvent
) => storeUser(event);
