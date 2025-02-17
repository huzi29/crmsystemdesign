import BookingController from "./booking.controller.js";
import EnquiryController from "./enquiry.controller.js";
import InteractionController from "./interaction.controller.js";
import LeadController from "./Lead.controller.js"

const Controllers = {
  LeadController: LeadController,
  InteractionController:InteractionController,
  EnquiryController:EnquiryController,
  BookingController:BookingController,
}

export default Controllers;

