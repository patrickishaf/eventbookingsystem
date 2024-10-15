import { Booking, findBookingById, insertBooking } from "../models/booking";

const bookingService = {
  async createBooking(booking: Partial<Booking>) {
    const id = await insertBooking(booking);
    return await findBookingById(id);
  }
};

export default bookingService;
