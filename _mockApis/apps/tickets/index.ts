import mock from '../../mockAdapter';
import { Chance } from 'chance';
const chance = new Chance();
interface TicketType {
    Id?: number | any;
    ticketTitle?: string;
    ticketDescription?: string;
    Status?: string;
    Label?:string;
    thumb?:string;
    AgentName?:string;
    Date?: string | Date;
}

const TicketData: TicketType[] = [
    {
        Id: 1,
        ticketTitle: 'Sed ut perspiciatis unde omnis iste',
        ticketDescription:
          'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
        Status: 'Closed',
        Label: 'error',
        thumb: "/images/profile/user-10.jpg",
        AgentName: 'Liam',
        Date: chance.date(),
      },
      {
        Id: 2,
        ticketTitle: 'Consequuntur magni dolores eos qui ratione',
        ticketDescription:
          'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
        Status: 'Pending',
        Label: 'warning',
        thumb: "/images/profile/user-2.jpg",
        AgentName: 'Steve',
        Date: chance.date(),
      },
      {
        Id: 3,
        ticketTitle: 'Exercitationem ullam corporis',
        ticketDescription:
          'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
        Status: 'Open',
        Label: 'success',
        thumb: "/images/profile/user-3.jpg",
        AgentName: 'Jack',
        Date: chance.date(),
      },
      {
        Id: 4,
        ticketTitle: 'Sed ut perspiciatis unde omnis iste',
        ticketDescription:
          'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
        Status: 'Closed',
        Label: 'error',
        thumb: "/images/profile/user-4.jpg",
        AgentName: 'Steve',
        Date: chance.date(),
      },
      {
        Id: 5,
        ticketTitle: 'Exercitationem ullam corporis',
        ticketDescription:
          'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
        Status: 'Closed',
        Label: 'error',
        thumb: "/images/profile/user-5.jpg",
        AgentName: 'Liam',
        Date: chance.date(),
      },
      {
        Id: 6,
        ticketTitle: 'Consequuntur magni dolores eos qui ratione',
        ticketDescription:
          'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
        Status: 'Pending',
        Label: 'warning',
        thumb: "/images/profile/user-6.jpg",
        AgentName: 'Jack',
        Date: chance.date(),
      },
      {
        Id: 7,
        ticketTitle: 'Sed ut perspiciatis unde omnis iste',
        ticketDescription:
          'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
        Status: 'Open',
        Label: 'success',
        thumb: "/images/profile/user-7.jpg",
        AgentName: 'Steve',
        Date: chance.date(),
      },
      {
        Id: 8,
        ticketTitle: 'Consequuntur magni dolores eos qui ratione',
        ticketDescription:
          'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
        Status: 'Closed',
        Label: 'error',
        thumb: "/images/profile/user-8.jpg",
        AgentName: 'John',
        Date: chance.date(),
      }
];



mock.onGet('/api/data/tickets/TicketData').reply(() => {
    return [200, TicketData];
});
export default TicketData;
