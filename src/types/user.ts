import { Document } from 'mongoose';

export interface User extends Document {

   email: string;
   password: string;
   name: string;
   phoneNumber: string;
   age: number;
   gender: string;
   role: string;

}