import defaultPage from "./pages/DefaultPage";
import PopoutComponents from "./pageSchemas/popoutSchema";
import AboutPageComponents from "./pageSchemas/aboutSchema";
import HomePageComponents from "./pageSchemas/homeSchema";
import HowItWorksComponents from "./pageSchemas/howItWorks";
import CareersPageComponents from "./pageSchemas/careerSchema";
import FaqComponents from "./pageSchemas/faqSchema";
import SupportPageComponents from "./pageSchemas/supportSchema";
import MainComponents from "./pageSchemas/mainSchema";
import CommonComponents from "./pageSchemas/commonSchema";
import SellOrTradeComponents from "./pageSchemas/sellOrTradeSchema";
import CarPageComponents from "./pageSchemas/carSchema";
import FlyoutComponents from "./pageSchemas/flyoutSchema";
import FindYourRidePageComponents from "./pageSchemas/findYourRideSchema";
import ShippingConfigurationComponents from "./pageSchemas/shippingConfigurationSchema";
import NotificationComponents from "./pageSchemas/notificationSchema";
import offsiteComponents from "./pageSchemas/offsiteSchema";
import OffsiteFindYourRidePageComponents from "./pageSchemas/offsiteFindYourRideSchema";
import OffsiteCarDetailsSchema from "./pageSchemas/offsiteCarDetailsSchema";
import partnerSalesCarDetailsSchema from "./pageSchemas/partnerSalesCarDetailsSchema";


export const schemaTypes = [
    defaultPage,
    ...PopoutComponents,
    ...CommonComponents,
    ...MainComponents,
    ...HomePageComponents,
    ...AboutPageComponents,
    ...HowItWorksComponents,
    ...SellOrTradeComponents,
    ...CareersPageComponents,
    ...FaqComponents,
    ...CarPageComponents,
    ...SupportPageComponents,
    ...FlyoutComponents,
    ...FindYourRidePageComponents,
    ...ShippingConfigurationComponents,
    ...NotificationComponents,
    ...offsiteComponents,
    ...OffsiteFindYourRidePageComponents,
    ...OffsiteCarDetailsSchema,
    ...partnerSalesCarDetailsSchema
];
