import React, {useState} from 'react'
import './reqops.css'
// Note: this will later transferred into different variants from different operations
function ReqOps(){

  function returntoprev() {
    // FIX: navigate to ??? page
  }

  function reqoperate(){
    /**
     * FIX: actually implement this
     */
  }


  return (
    <div>
      <section>Published: Monday, July 13rd</section>
      <section>Price: ?</section>
      <section id='reqtitle'>
        <div>Departure Date</div>
        <div>?</div>
        <div>??</div>
      </section>
      <section id='reqinfo'>
        <div>mm/dd/yyyy</div>
        <div>from</div>
        <div>to</div>
      </section>
      <section id="requester">
        <div>Offer Giver Name</div>
        <img id="star.png"></img><div>4.5/5</div>
        <div>- [int] ratings</div>
        <img id="offer giver profile picture"></img>
      </section>
      <section id="requestcontact">
        <img id="contact icon"></img><a href="">Contact XXX</a>
      </section>
      <section id="requestaddition">
        <div>Do you want others to share the ride? Yes/No</div>
        <div>Description
          <p id="reqdesc">more description text</p>
        </div>
      </section>
      <section id="requestroperate">
        <button onclick={reqoperate}>do something with offer</button>
        <button onclick={returntoprev}>go back to previous page</button>
      </section>
    </div>
  )
}

export default ReqOps;