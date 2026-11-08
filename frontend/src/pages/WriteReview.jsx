
import { useState } from "react";
import { Link } from "react-router-dom";

function WriteReview() {
  const [overallRating, setOverallRating] = useState(5);
  const [quality, setQuality] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [review, setReview] = useState("");
  const [recommend, setRecommend] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your review has been submitted!");
  };

  const renderRating = (value, setValue) => (
    <div className="wr-rating-options">
      {[1, 2, 3, 4, 5].map((number) => (
        <label key={number}>
          <input
            type="radio"
            name={`rating-${setValue.name || Math.random()}`}
            checked={value === number}
            onChange={() => setValue(number)}
          />
          <span>{number}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="wr-page">

      {/* HEADER */}

      <header className="wr-header">

        <Link to="/" className="wr-logo">
          <span></span>
          Bhorsa
        </Link>

        <nav className="wr-nav">
          <Link to="/customer">Customer</Link>
          <Link to="/provider">Provider</Link>
          <Link to="/admin">Admin</Link>

          <div className="wr-avatar"></div>

          <Link to="/login" className="wr-logout">
            Log out
          </Link>
        </nav>

      </header>


      {/* MAIN CONTENT */}

      <main className="wr-main">

        <div className="wr-breadcrumb">
          <Link to="/customer/bookings">My bookings</Link>
          {" "}› Write a review
        </div>


        <div className="wr-layout">

          {/* REVIEW FORM */}

          <section className="wr-review-card">

            <div className="wr-title-row">
              <h1>Rate your experience</h1>

              <span className="wr-verified">
                Verified Booking
              </span>
            </div>


            <form onSubmit={handleSubmit}>

              {/* OVERALL RATING */}

              <div className="wr-overall-rating">

                <div className="wr-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setOverallRating(star)}
                      className={
                        star <= overallRating ? "selected" : ""
                      }
                    >
                      ★
                    </button>
                  ))}
                </div>

                <p>
                  Overall rating: {overallRating} out of 5
                </p>

              </div>


              {/* CATEGORY RATINGS */}

              <div className="wr-rating-row">
                <strong>Quality</strong>
                {renderRating(quality, setQuality)}
              </div>

              <div className="wr-rating-row">
                <strong>Punctuality</strong>
                {renderRating(punctuality, setPunctuality)}
              </div>

              <div className="wr-rating-row">
                <strong>Communication</strong>
                {renderRating(communication, setCommunication)}
              </div>


              {/* WRITE REVIEW */}

              <label className="wr-review-label">
                Write your review
              </label>

              <textarea
                rows="4"
                placeholder="What went well? What could be better?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>


              {/* RECOMMEND */}

              <label className="wr-recommend">

                <input
                  type="checkbox"
                  checked={recommend}
                  onChange={(e) => setRecommend(e.target.checked)}
                />

                <span>
                  I would recommend this provider
                </span>

              </label>


              {/* BUTTONS */}

              <div className="wr-buttons">

                <button type="submit" className="wr-submit">
                  Submit review
                </button>

                <Link
                  to="/customer/bookings"
                  className="wr-cancel"
                >
                  Cancel
                </Link>

              </div>

            </form>

          </section>


          {/* RIGHT SIDE */}

          <aside className="wr-right-side">


            {/* BOOKING INFORMATION */}

            <section className="wr-booking-card">

              <h2>Booking BK-0000</h2>

              <div className="wr-provider-info">

                <div className="wr-provider-avatar"></div>

                <div>
                  <strong>Provider name</strong>
                  <p>Deep cleaning · Completed</p>
                </div>

              </div>

              <Link
                to="/provider/1"
                className="wr-view-provider"
              >
                View provider
              </Link>

            </section>


            {/* INFORMATION CARD */}

            <section className="wr-info-card">

              <h2>Why only verified bookings?</h2>

              <p>
                Only customers with a completed booking can
                review, so every rating on Bhorsa is real.
                Reviews cannot be edited after 7 days.
              </p>

            </section>

          </aside>

        </div>

      </main>


      {/* FOOTER */}

      <footer className="wr-footer">

        <strong>
          Bhorsa · Trusted local services
        </strong>

        <div>
          About · Contact · Privacy Policy · Terms
        </div>

      </footer>

    </div>
  );
}

export default WriteReview;
