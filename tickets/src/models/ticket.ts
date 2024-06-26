import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

interface TicketDoc extends mongoose.Document{
  title: string;
  price: number;
  userId: string;
  version: number;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      // referring to the global String constructor in JavaScript, capital "S"
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true
    }
  }, {
    toJSON: {
      // ret is the object that will be turned into JSON
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
)

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

// simply to have typescript a tell us the attributes
// to be provided
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };