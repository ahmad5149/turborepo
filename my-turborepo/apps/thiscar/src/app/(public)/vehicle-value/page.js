import { VehicleValueStyles } from "./trade-pending";

export const metadata = {
  title: "Get My Vehicle Value from THIScar.com",
};

export default function VehicleValuePage() {
  return (
    <>
      <section id="contentlp">
        <div className="tradetool">[insert trade tool]</div>
        <div className="contentsection">
          <h1>Get Your Vehicle's True Trade Value</h1>
          <h2>All It Takes Is 2 Steps & 10 Seconds</h2>
        </div>
        <p>
          <img
            src="https://s3.amazonaws.com/cka-dash/037-0923-THI23589/mainimage.webp"
            alt="2 white cars in parked"
            width="100%"
          />
        </p>
        <div className="contentsection">
          <h2>
            Making an informed decision is all the more important these days
          </h2>
          <hr />
          <p>
            See the market for your vehicle now and let THISCar give you their
            highest value for it! We'll even pick it up from your house for free
            if you want to sell or trade. All it takes is 2 steps and 10 seconds
            to see just how much more your car is worth.
          </p>
          <p>
            Plus, you'll be using the same market-driven data we do so you'll
            know everything about your vehicle that we do. No guesswork, no
            ambiguous numbers; just true value.
          </p>
        </div>
      </section>
      <VehicleValueStyles />
    </>
  );
}
