import { create } from "xmlbuilder";

export const generateADFXMLString = (adfData, url) => {
    const adf = create({
        version: "1.0",
        encoding: "UTF-8"
    })
        .ele("adf")
        .ele("prospect", { status: adfData.Prospect.Status }); // Assuming 'status' is a property of 'Prospect'

    adfData.Vehicles?.forEach((vehicle) => {
        adf.ele("vehicle")
            .ele("year", vehicle.Year) // Assuming 'year' is a property of 'Vehicle'
            .up()
            .ele("make", vehicle.Make) // Assuming 'make' is a property of 'Vehicle'
            .up()
            .ele("model", vehicle.Model) // Assuming 'model' is a property of 'Vehicle'
            .up()
            .ele("vin", vehicle.Vin) // Assuming 'Vin' is a property of 'Vehicle'
            .up();
        // Add more vehicle details
        adf.up();
    });

    const customerXml = create("customer").ele("contact");

    adfData.Customer.Contact.Names?.forEach((name) => {
        customerXml.ele("name", { part: name.NamePart }, name.Value).up();
    });

    adfData.Customer.Contact.PhoneNumbers?.forEach((phone) => {
        customerXml.ele("phone", phone.Value);
    });

    // Append the customerXml to the existing ADF structure
    adf.importDocument(customerXml);

    // Add the provider tag after the customer tag
    const providerXml = create("provider")
        .ele("name", { part: "full" }, "THIScar availability check")
        .up()
        .ele("url", url);

    adf.importDocument(providerXml);

    return adf.end({ prettyPrint: true });
};
