const GetDeliveryInfo = (car) => {
  let start = 5;
  let end = 8;
  if (car?.shippingInformation) {
    start = car.shippingInformation.deliveryEstimateInDays?.start;
    end = car.shippingInformation.deliveryEstimateInDays?.end;
  }
  return `Arrives in ${start}-${end} days`;
};

export { GetDeliveryInfo };
