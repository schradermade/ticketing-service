import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
  // Create an insgtance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  })
  
  // Save the ticket to the DB
  ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two seperate changes to the tickets we fetched
  firstInstance?.set({ price: 10 })
  secondInstance?.set({ price: 15 })

  // save the first fetched ticket
  await firstInstance?.save()

  // save the second fetched ticket
  try {
    await secondInstance?.save()
  } catch (error) {
    return;
  }

  throw new Error('Should not reach this point');
})

it('increments the version number on multiple saves', async () => {
  // Create instance of ticket
  const movieTicket = Ticket.build({
    title: 'movie',
    price: 55,
    userId: '344'
  })

  await movieTicket.save()
  expect(movieTicket.version).toEqual(0);
  await movieTicket.save()
  expect(movieTicket.version).toEqual(1);
  await movieTicket.save()
  expect(movieTicket.version).toEqual(2);
})