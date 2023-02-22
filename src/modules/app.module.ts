import { UsersModule } from './system/users/users.module';
import { AuthModule } from './system/auth/auth.module';
import { mongooseOptions } from '@shared/options/mongoose.options';
import { constants } from '@shared/constants/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { plugin } from 'mongoose';

// Inject handler and the incrementor of document version "__v"
import * as mongooseUpdateDocumentVersion from 'mongoose-update-document-version';
plugin(mongooseUpdateDocumentVersion);

// Inject create date and update date in all mongoose schemas
import * as timestamps from 'mongoose-timestamp';
plugin(timestamps);

// Inject soft-delete in all mongoose schemas
import * as mongooseDelete from 'mongoose-delete';
import { ScheduleModule } from '@nestjs/schedule';
import { I18nModule } from 'nestjs-i18n';
import { QueryResolver } from 'nestjs-i18n/dist/resolvers/query.resolver';
import { AcceptLanguageResolver } from 'nestjs-i18n/dist/resolvers/accept-language.resolver';
import path = require('path');
plugin(mongooseDelete, { deletedAt: true });

@Module({
  imports: [
    /* Mongoose DB connection Init */
    MongooseModule.forRoot(
      process.env.DB_URI,
      mongooseOptions,
    ),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    /* Serve static files at Public [eg: index.html, uploads] */
    ServeStaticModule.forRoot({
      rootPath: join('.', 'public'),
    }),
    ScheduleModule.forRoot(),
    /* App Modules */
    AuthModule,
    UsersModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../shared/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
