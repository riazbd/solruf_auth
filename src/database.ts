import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'solruf_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default typeOrmConfig;
