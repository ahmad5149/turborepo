"use client";
import { BannerPath } from "../common/defaultImage/DefaultPaths";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import "../../contents/scss/carDelivery.scss";
import WordRotator from "./WordRotator";
import { SanityImage } from "@/sanity/SanityImage";

const CarDelivery = ({ carDelivery }) => {
  return (
    <div className="container carDelivery">
      <div className="row">
        <div className="col-lg-6 col-sm-10 col-md-8 m-auto text-center">
          <h1 className="heading-carDelivery position-relative d-flex mb-0">
            {carDelivery.titleStart} {" "} <br></br>
            <WordRotator words={carDelivery.typeWords}></WordRotator>
            <br></br>
          </h1>
          <h1 className="heading-carDelivery d-flex justify-content-start">
            {carDelivery.titleEnd}
          </h1>
          <SanityImage
            src={carDelivery.image}
            defaultImage={GetDefaultImagePath(BannerPath)}
            alt=""
            className="image"
            width={480}
            height={340}
          ></SanityImage>
        </div>
      </div>
    </div>
  );
};

export default CarDelivery;
