import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function () {
            console.log('This is pre save');
          });
          return schema;
        },
      },
    ]),
  ],
  providers: [UserService],
  controllers: [],
  exports: [UserService],

})
export class UserModule {}
