class ExtendableError extends Error {
  err: string;
  statusCode: number;

  constructor(err: string) {
    super(err);
    Object.setPrototypeOf(this, ExtendableError.prototype);

    this.name = this.constructor.name;
    this.err = err;
  }
}

export class AuthError extends ExtendableError {
  constructor(err: string) {
    super(err);

    this.statusCode = 401;
    this.name = 'AuthError';
  }
}

export class NotFoundError extends ExtendableError {
  constructor(err: string) {
    super(err);

    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends ExtendableError {
  constructor(err: string) {
    super(err);

    this.statusCode = 400;
    this.name = 'BadRequestError';
  }
}
