import IModel from '../../common/IModel.interface';

export default class UserModel implements IModel {
    userId: number;
    createdAt: Date;
    username: string;
    email: string;
    passwordHash: string;
    forename: string;
    surname: string;
    isActive: boolean;
}