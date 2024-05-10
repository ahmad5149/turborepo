import Link from "next/link";

export default function CarProAppraisalProThankYouPage() {
  return (
    <div className="d-flex flex-column container my-5 align-items-center">
      <div className="card" style={{ maxWidth: "768px" }}>
        <div className="card-body d-flex flex-column align-items-center text-center">
          <img
            width={357}
            height={126}
            src="/media/carpro_appraisal_pro_logo.png"
            alt="CarPro Appraisal Pro"
          />
          <h1 className="display-5 my-4">Thinking of trading it in?</h1>
          <p style={{ color: "slategrey" }} className="lead my-4">
            Find your new wheels{" "}
            <Link
              href={`/cars?utm_source=thiscar&utm_campaign=carpro_appraisal_pro_thank_you&utm_medium=website`}
              as={`/cars`}
            >
              HERE
            </Link>{" "}
            -- we have thousands to choose from -- all of which can be delivered
            right to your door!
          </p>
          <ul className="list-unstyled">
            <li
              className="mb-2"
              style={{ fontSize: "1.2rem", fontWeight: 300, lineHeight: 1.3 }}
            >
              Delivered to your door?{" "}
              <span style={{ color: "#e1ad01" }}>YES</span>
            </li>
            <li
              className="mb-2"
              style={{ fontSize: "1.2rem", fontWeight: 300, lineHeight: 1.3 }}
            >
              Comes with a money back guaranteed?{" "}
              <span style={{ color: "#e1ad01" }}>YES!</span>
            </li>
            <li
              className="mb-2"
              style={{ fontSize: "1.2rem", fontWeight: 300, lineHeight: 1.3 }}
            >
              Fixed no-hassle pricing?{" "}
              <span style={{ color: "#e1ad01" }}>YES!</span>
            </li>
            <li
              className="mb-2"
              style={{ fontSize: "1.2rem", fontWeight: 300, lineHeight: 1.3 }}
            >
              Easy &amp; affordable financing?{" "}
              <span style={{ color: "#e1ad01" }}>YES!</span>
            </li>
            <li
              className="mb-2"
              style={{ fontSize: "1.2rem", fontWeight: 300, lineHeight: 1.3 }}
            >
              Comes with CarPro stamp of approval{" "}
              <span style={{ color: "#e1ad01" }}>YES!</span>
            </li>
          </ul>

          <h2>
            <Link
              style={{ color: "#e1ad01" }}
              href="/cars?utm_source=thiscar&utm_campaign=carprop_appraisal_pro_thank_you&utm_medium=website"
              as="/cars"
            >
              Take a look &amp; Shop Here
            </Link>
          </h2>
        </div>
      </div>
    </div>
  );
}
