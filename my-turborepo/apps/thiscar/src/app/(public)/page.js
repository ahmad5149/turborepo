import CarDelivery from "../../components/home/CarDelivery";
import FindYourCar from "../../components/home/FindYourCar";
import CarsWeLoveForYou from "../../components/home/CarsWeLoveForYou";
import FreePersonalShopper from "../../components/home/FreePersonalShopper";
import MoreCarsMoreChoices from "../../components/home/MoreCarsMoreChoices";
import FastTrackToFinding from "../../components/home/FastTrackToFinding";
import YourPerfectCar from "../../components/home/YourPerfectCar";
import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../appConfig";
import { useHomePageContent, SanityImageURL } from "@/sanity/Sanity";
import ButtonSection from "../../components/home/ButtonSection";
import { GetBodyStyleCounts } from "@/services/carService";
import "../../contents/scss/home.scss";
import { LoadTradePending } from "@/components/trade-pending/trade-pending-hook";
//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export async function generateMetadata() {
  const data = await useHomePageContent();
  // will return vehicle data
  if (data != null) {
    const pageTitle = [
      data?.carDelivery?.titleStart,
      data?.carDelivery?.typeWords[0],
    ]
      .filter(Boolean)
      .join(" ");
    const pageDescription = [
      data?.carDelivery?.titleStart,
      data?.carDelivery?.typeWords[0],
    ]
      .filter(Boolean)
      .join(" ");
    const imageUrl = SanityImageURL(data.carDelivery.image);

    // add og tags
    return {
      title: GetTabName(data.metaData.title),
      description: data.metaData.description,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        images: imageUrl != null ? imageUrl : "",
        url: appConfig.BASE_URL,
      },
    };
  }
}

export default async function Home() {
  const data = await useHomePageContent();
  const bodyStyleCounts = await GetBodyStyleCounts();

  return (
    <>
      <div className="home-page-overflow text-center">
        <ButtonSection />
        {data?.carDelivery && <CarDelivery carDelivery={data.carDelivery} />}
        {data?.findYourCar && <FindYourCar findYourCar={data.findYourCar} />}
        {data?.carsWeLoveForYou && (
          <CarsWeLoveForYou
            bodyStyleCounts={bodyStyleCounts}
            carsWeLoveForYou={data.carsWeLoveForYou}
          />
        )}
        {data?.personalShopper && (
          <FreePersonalShopper personalShopper={data.personalShopper} />
        )}
        <div className="container-md my-lg-5 my-sm-0">
          {data?.moreCarsMoreChoices && (
            <MoreCarsMoreChoices
              moreCarsMoreChoices={data.moreCarsMoreChoices}
            />
          )}
          {data?.fastTrackToFinding && (
            <FastTrackToFinding fastTrackToFinding={data.fastTrackToFinding} />
          )}
          {data?.yourPerfectCar && (
            <YourPerfectCar perfectCar={data.yourPerfectCar} />
          )}
        </div>
      </div>
      {/* <LoadTradePending /> */}
    </>
  );
}
