import React from "react";
import FeatureItem from "./FeatureItem";

function FeatureItems(props) {
  const pairs = props.featureItems.split("|");
  const options = {};

  pairs.forEach((pair) => {
    const [key, value] = pair.split("@");

    if (!options[key]) {
      options[key] = [];
    }

    options[key].push(value.trim());
  });

  return (
    <>
      <div
        className="accordion accordion-detail-car"
        id="accordionExampleFeatureItems"
      >
        {Object.entries(options).map(([key, value], index) => (
          <>
            {value && value.length > 0 && (
              <FeatureItem index={index} items={key} values={value} />
            )}
          </>
        ))}
      </div>
    </>
  );
}

export default FeatureItems;
