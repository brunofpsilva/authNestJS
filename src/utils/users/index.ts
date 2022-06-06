import { User } from 'src/users/users.schema';

export function cleanUser(user: User): User {
  const sanitized = <User>user.toObject();
  delete sanitized['password'];
  delete sanitized['hash'];
  return sanitized;
}
