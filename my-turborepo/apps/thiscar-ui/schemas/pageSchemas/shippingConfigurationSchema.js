import distanceSection from '../shippingConfiguration/distanceSection'
import paddingSection from '../shippingConfiguration/paddingSection'
import pricingSection from '../shippingConfiguration/pricingSection'
import fareCalculator from '../shippingConfiguration/marginCalculations/fareCalculator'
import fareMarginLevels from '../shippingConfiguration/marginCalculations/fareMarginLevels'
import ShippingConfigurationPage from '../pages/ShippingConfigurationPage'

export default [
    distanceSection,
    paddingSection,
    pricingSection,
    fareCalculator,
    fareMarginLevels,
    ShippingConfigurationPage,
]