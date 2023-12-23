const mockOrganisation = {
  findFirst: jest.fn().mockReturnThis(),
};

const mockUser = {
  create: jest.fn().mockReturnThis(),
};

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.fn().mockImplementation(() => ({
      organisation: mockOrganisation,
      user: mockUser,
    })),
  };
});

import { storeUser } from './user';

describe('User Service', () => {
  describe('#storeUser', () => {
    it('should throw an error if organisation does not exist', async () => {
      mockOrganisation.findFirst.mockResolvedValue(null);

      const logSpy = jest.spyOn(console, 'error');

      await storeUser({
        version: '1',
        region: 'eu-west-2',
        userPoolId: 'eu-west-2_xxXXXxxx',
        userName: '71e43a8a-xxxx-4dd7-xxxx-cfeafcb77add',
        callerContext: {
          awsSdkVersion: 'aws-sdk-unknown-unknown',
          clientId: 'some-client-id',
        },
        triggerSource: 'PostConfirmation_ConfirmSignUp',
        request: {
          userAttributes: {
            sub: '71e43a8a-xxxx-4dd7-xxxx-cfeafcb77add',
            email_verified: 'true',
            birthdate: '01/01/1999',
            'cognito:user_status': 'CONFIRMED',
            'cognito:email_alias': 'some.one@email.com',
            given_name: 'Some',
            family_name: 'One',
            email: 'some.one@email.com',
            'custom:organisation': 'Example Organisation',
          },
        },
        response: {},
      });

      expect(logSpy).toHaveBeenCalledWith(
        `Organisation with name: 'Example Organisation' could not be found. User was not added to the database.`
      );
    });

    it('should call user create', async () => {
      mockOrganisation.findFirst.mockResolvedValue({
        id: 'some-id',
        name: 'Example Organisation',
      });

      await storeUser({
        version: '1',
        region: 'eu-west-2',
        userPoolId: 'eu-west-2_xxXXXxxx',
        userName: '71e43a8a-xxxx-4dd7-xxxx-cfeafcb77add',
        callerContext: {
          awsSdkVersion: 'aws-sdk-unknown-unknown',
          clientId: 'some-client-id',
        },
        triggerSource: 'PostConfirmation_ConfirmSignUp',
        request: {
          userAttributes: {
            sub: '71e43a8a-xxxx-4dd7-xxxx-cfeafcb77add',
            email_verified: 'true',
            birthdate: '01/01/1999',
            'cognito:user_status': 'CONFIRMED',
            'cognito:email_alias': 'some.one@email.com',
            given_name: 'Some',
            family_name: 'One',
            email: 'some.one@email.com',
            'custom:organisation': 'Example Organisation',
          },
        },
        response: {},
      });

      const createSpy = jest.spyOn(mockUser, 'create');
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          organisationId: 'some-id',
          firstName: 'Some',
          lastName: 'One',
          email: 'some.one@email.com',
          birthdate: '01/01/1999',
          cognitoId: '71e43a8a-xxxx-4dd7-xxxx-cfeafcb77add',
        },
      });
    });
  });
});
