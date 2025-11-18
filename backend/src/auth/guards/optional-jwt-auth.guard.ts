import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to allow requests without token
  handleRequest(err: any, user: any) {
    // Return user if authenticated, otherwise return null
    return user;
  }
}
