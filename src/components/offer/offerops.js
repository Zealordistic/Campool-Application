import React, {useState} from 'react'
import './offerops.css'
// Note: this will later transferred into different variants from different operations
function OfferOps(){

  function returntoprev() {
    // FIX: navigate to ??? page
  }

  function offeroperate(){
    /**
     * Permissions of users: (D - driver only, P - passenger operable)
     * Allowed operations include(with permissions):{
     *  [D]  Create Offer
     *  [D]  Modify Offer
     *  [D]  Delete Offer
     *  [PD] Join Offer
     *  [PD] Withdraw Offer
     * }
     * FIX: actually implement this
     */
  }


  return (
    <div>
      <section>Published: Monday, July 12nd</section>
      <section>Price: ?</section>
      <section id='offertitle'>
        <div>Departure Date</div>
        <div>?</div>
        <div>??</div>
      </section>
      <section id='offerinfo'>
        <div>mm/dd/yyyy</div>
        <div>from</div>
        <div>to</div>
      </section>
      <section id="offerer">
        <div>Offer Giver Name</div>
        <img id="star.png"></img><div>4.5/5</div>
        <div>- [int] ratings</div>
        <img id="offer giver profile picture"></img>
      </section>
      <section id="offercontact">
        <img id="contact icon"></img><a href="">Contact XXX</a>
      </section>
      <section id="offeraddition">
        <div>Max ? people in ? seats</div>
        <div>Plate Number - Car Model - Car color</div>
        <div>Description
          <p id="offerdesc">more description text</p>
        </div>
      </section>
      <section id="offeroperate">
        <button onclick={offeroperate}>do something with offer</button>
        <button onclick={returntoprev}>go back to previous page</button>
      </section>
    </div>
  )
}

export default OfferOps;