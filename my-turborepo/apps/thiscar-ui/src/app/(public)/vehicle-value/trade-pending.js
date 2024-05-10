"use client";
export function VehicleValueStyles() {
  return (
    <style jsx>
      {`
        #contentlp {
          display: grid;
          margin: 0 auto;
          padding: 0;
          max-width: 1920px;
          width: 100%;
          box-sizing: border-box;
        }
        #contentlp * {
          box-sizing: border-box;
        }
        #contentlp hr {
          width: 100%;
          border: 0;
          height: 1px;
          background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.75),
            rgba(0, 0, 0, 0)
          );
          margin: 1rem auto;
        }
        #contentlp .contentsection {
          padding: 2rem;
        }
        #contentlp .txtcenter {
          text-align: center;
        }
        #contentlp .disclaimer {
          font-size: 0.75em;
          font-style: italic;
        }
      `}
    </style>
  );
}
