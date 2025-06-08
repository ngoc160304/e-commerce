import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { BAD_REQUEST, CONFLICT } from '~/core/errors.response';
import { userRepo } from '~/models/repositories/user.repo';
import { ROLE_NAME, STATUS } from '~/utils/constant';

class AccessService {
  static register = async (data: {
    email: string;
    phone?: string;
    gender: string;
    password: string;
  }) => {
    const emailExist = await userRepo.findOneByEmail(data.email);
    if (emailExist) {
      if (emailExist.status === STATUS.PENDING) {
        throw new CONFLICT('Please check your email to verify your account !');
      }
      throw new BAD_REQUEST('Email is already exist !');
    }
    const username = data.email.split('@')[0];
    const newPassowrd = bcrypt.hashSync(data.password, 10);
    const newUser = {
      ...data,
      username: username,
      displayName: username,
      password: newPassowrd,
      status: STATUS.PENDING,
      verifyToken: uuidv4(),
      avatar: null,
      roles: [...Object.values(ROLE_NAME)],
      dateOfBirth: null,
      createdAt: new Date(),
      updatedAt: null
    };
    const userCreated = await userRepo.createNew(newUser);
    if (!userCreated) {
      throw new BAD_REQUEST();
    }
    return {
      message: 'Create new user success !'
    };
  };
}
export default AccessService;
