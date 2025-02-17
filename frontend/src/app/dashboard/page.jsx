import React from 'react'
import Leads from '@/components/LeadsComponents/Leads'
import Interactions from '@/components/InteractionComponents/Interactions'
import Enquiry from '@/components/EnquiresComponent/Enquiry'
import Booking from '@/components/BookingComponent/Booking'

const page = () => {
  return (
    <>
    <Leads/>
    <Interactions/>
    <Enquiry/>
    <Booking/>
    </>
  )
}

export default page