import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [AuthModule],
  providers: [EventsService, EventsGateway],
  exports: [EventsService, EventsGateway],
})
export class EventsModule {}
