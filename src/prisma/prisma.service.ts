import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://neondb_owner:npg_tLjZqOUKk81P@ep-icy-rice-a8rboye0-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
        },
      },
    });
  }
}
