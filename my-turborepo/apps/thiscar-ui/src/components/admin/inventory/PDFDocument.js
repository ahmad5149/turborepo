// components/PDFDocument.js
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { styles } from "../../../contents/js/PDFStyles"; // Import styles from the styles.js file

// Create styles
const PDFDocument = ({ purchaseAgreement }) => (
    <Document>
        <Page
            size="A4"
            style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.stock_text}>Stock # {purchaseAgreement?.carData?.dealerStockId}</Text>
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        src="/media/ThisCarPDFlogo.png"
                    />
                </View>
                <View style={[styles.container, styles.margin_Bottom10]}>
                    <Text style={[styles.heading, styles.underline]}>VEHICLE PURCHASE AGREEMENT</Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>SELLER: {purchaseAgreement?.sellerData?.name}</Text>
                    <Text style={[styles.colText, styles.text10]}>DATE: </Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>
                        ADDRESS: {purchaseAgreement?.sellerData?.address}{" "}
                    </Text>
                    <Text style={[styles.colText, styles.text10]}>CITY: {purchaseAgreement?.sellerData?.city}</Text>
                    <Text style={[styles.colText, styles.text10]}>STATE: {purchaseAgreement?.sellerData?.state}</Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>
                        ZIP: {purchaseAgreement?.sellerData?.dealerZipCode}
                    </Text>
                    <Text style={[styles.colText, styles.text10]}>PHONE: {purchaseAgreement?.sellerData?.phone}</Text>
                    <Text style={[styles.colText, styles.text10]}>EMAIL:</Text>
                </View>

                <View style={[styles.purchaseSection]}>
                    <Text style={[styles.text10, styles.underline]}>PURCHASER:</Text>
                    <Text style={styles.addressText}>
                        {purchaseAgreement?.dealerData?.name == "THIScar.com"
                            ? "THIScar, LLC"
                            : purchaseAgreement?.dealerData?.name}{" "}
                        / {purchaseAgreement?.userName} {purchaseAgreement?.dealerData?.address}{" "}
                        {purchaseAgreement?.dealerData?.city}, {purchaseAgreement?.dealerData?.state}{" "}
                        {purchaseAgreement?.dealerData?.dealerZipCode} {purchaseAgreement?.dealerData?.phone}
                    </Text>
                </View>

                <View style={styles.container}>
                    <Text style={[styles.heading, styles.margin_Top5, styles.margin_Bottom5]}>VEHICLE DESCRIPTION</Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>YEAR: {purchaseAgreement?.carData?.year}</Text>
                    <Text style={[styles.colText, styles.text10]}>MAKE: {purchaseAgreement?.carData?.make}</Text>
                    <Text style={[styles.colText, styles.text10]}>MODEL: {purchaseAgreement?.carData?.model}</Text>
                    <Text style={[styles.colText, styles.text10]}>TRIM: {purchaseAgreement?.carData?.trim}</Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>
                        EXTERIOR COLOR: {purchaseAgreement?.carData?.extColor}
                    </Text>
                    <Text style={[styles.colText, styles.text10]}>
                        INTERIOR: {purchaseAgreement?.carData?.interiorColor}
                    </Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>VIN: {purchaseAgreement?.carData?.vin}</Text>
                    <Text style={[styles.colText, styles.text10]}>
                        MILES: {purchaseAgreement?.carData?.odometer?.toLocaleString()}
                    </Text>
                    <Text style={[styles.colText, styles.text10]}>ACTUAL: X IN EXCESS UNK:</Text>
                </View>

                <View style={[styles.purchaseSection]}>
                    <Text style={styles.text10}>CASH PURCHASE PRICE: $</Text>
                    <Text style={[styles.text10, styles.underline]} />
                </View>
                <View>
                    <Text style={[styles.text10, styles.lineHeight, styles.margin_Top5]}>
                        CONDITIONS, COMMENTS OR DISCLOSURES REGARDING THIS VEHICLE:
                    </Text>
                    <Text style={[styles.text10, styles.lineHeight]}>
                        __________________________________________________________________________________________________
                    </Text>
                    <Text style={[styles.text10, styles.lineHeight]}>
                        __________________________________________________________________________________________________
                    </Text>
                    <Text style={[styles.text10, styles.lineHeight]}>
                        __________________________________________________________________________________________________
                    </Text>
                    <Text style={[styles.text10, styles.lineHeight]}>
                        ______________________________________________
                    </Text>
                </View>

                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>
                        SELLER NAME: {purchaseAgreement?.sellerData?.name}
                    </Text>
                    <Text style={[styles.colText, styles.text10]}>SELLER SIGNATURE:</Text>
                    <Text style={[styles.colText, styles.text10]}>DATE:</Text>
                </View>

                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>
                        BUYER NAME:{" "}
                        {purchaseAgreement?.dealerData?.name == "THIScar.com"
                            ? "THIScar, LLC"
                            : purchaseAgreement?.dealerData?.name}{" "}
                        / {purchaseAgreement?.userName}
                    </Text>
                    <Text style={[styles.colText, styles.text10]}>BUYER SIGNATURE:</Text>
                    <Text style={[styles.colText, styles.text10]}>DATE:</Text>
                </View>

                <View style={[styles.container, styles.margin_Bottom5]}>
                    <Text style={[styles.text10, styles.margin_Top20]}>
                        By signing this agreement both buyer and seller agree that this is a final, as-is sale/purchase.
                    </Text>
                </View>

                <Text style={[styles.stock_text, styles.margin_Top20]}>
                    Stock # {purchaseAgreement?.carData?.dealerStockId}
                </Text>
                <View style={[styles.container, styles.lineHeight]}>
                    <Text style={[styles.page_heading]}>ODOMETER DISCLOSURE STATEMENT</Text>
                </View>

                <View style={styles.margin_Top5}>
                    <Text style={[styles.text12]}>
                        Federal and State law require that you state the mileage upon transfer of ownership. Failure to
                        complete or providing a false statement may result in fines and/or imprisonment
                    </Text>
                </View>

                <View style={[styles.odometer_section, styles.margin_Top15]}>
                    <Text style={styles.text10}>
                        I, <Text style={[styles.underline, styles.text10]}>{purchaseAgreement?.sellerData?.name}</Text>{" "}
                        (SELLER’S NAME) state that the odometer now reads{" "}
                        <Text style={[styles.underline, styles.text10]}>
                            {purchaseAgreement?.carData?.odometer?.toLocaleString()}
                        </Text>{" "}
                        miles (NO TENTHS) and to the best of my knowledge that it reflects the actual mileage of the
                        vehicle described below, unless one of the following statements is checked
                    </Text>
                </View>

                <View style={[styles.odometer_sect, styles.margin_Top15]}>
                    <View style={styles.square}></View>

                    <Text style={styles.text10}>
                        - (1) I hereby certify that the odometer reading reflects the amount of mileage in excess of its
                        mechanical limits
                    </Text>
                </View>
                <View style={[styles.odometer_sect, styles.margin_Top15]}>
                    <View style={styles.square}></View>
                    <Text style={styles.text10}>
                        - (2) I hereby certify that the odometer reading is not the actual mileage.
                        <Text style={[styles.text10, styles.font_Weight]}> WARNING – ODOMETER DISCREPANCY</Text>
                    </Text>
                </View>

                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>MAKE: {purchaseAgreement?.carData?.make}</Text>
                    <Text style={[styles.colText, styles.text10]}>
                        BODY STYLE: {purchaseAgreement?.carData?.bodyStyle}
                    </Text>
                    <Text style={[styles.colText, styles.text10]}>YEAR: {purchaseAgreement?.carData?.year}</Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>MODEL: {purchaseAgreement?.carData?.model}</Text>
                    <Text style={[styles.colText, styles.text10]}>VIN: {purchaseAgreement?.carData?.vin}</Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>LAST PLATE STATE:</Text>
                    <Text style={[styles.colText, styles.text10]}>LAST PLATE NUMBER:</Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10, styles.font_Weight]}>
                        DEALER STOCK NUMBER: {purchaseAgreement?.carData?.dealerStockId}
                    </Text>
                </View>

                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text12, styles.font_Weight, styles.margin_Top15]}>
                        SELLER'S SIGNATURE:
                    </Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>
                        SELLER'S NAME: {purchaseAgreement?.sellerData?.name}
                    </Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>
                        SELLER'S ADDRESS: {purchaseAgreement?.sellerData?.address}
                    </Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>CITY: {purchaseAgreement?.sellerData?.city}</Text>
                    <Text style={[styles.colText, styles.text10]}>STATE: {purchaseAgreement?.sellerData?.state}</Text>
                    <Text style={[styles.colText, styles.text10]}>
                        ZIP CODE: {purchaseAgreement?.sellerData?.dealerZipCode}
                    </Text>
                </View>
                <Text style={[styles.text10, styles.lineHeight, styles.margin_Top15]}>
                    ACKNOWLEDGING MILEAGE READING AS CERTIFIED
                </Text>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text12, styles.font_Weight]}>BUYER'S SIGNATURE:</Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>
                        BUYER'S NAME:{" "}
                        {purchaseAgreement?.dealerData?.name == "THIScar.com"
                            ? "THIScar, LLC"
                            : purchaseAgreement?.dealerData?.name}{" "}
                        / {purchaseAgreement?.userName}
                    </Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>
                        BUYER'S ADDRESS: {purchaseAgreement?.dealerData?.address}
                    </Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10]}>CITY: {purchaseAgreement?.dealerData?.city}</Text>
                    <Text style={[styles.colText, styles.text10]}>STATE: {purchaseAgreement?.dealerData?.state}</Text>
                    <Text style={[styles.colText, styles.text10]}>
                        ZIP CODE: {purchaseAgreement?.dealerData?.dealerZipCode}
                    </Text>
                </View>
                <View style={[styles.vehicleDescription]}>
                    <Text style={[styles.colText, styles.text10, styles.font_Weight]}>DATE OF CERTIFICATION:</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default PDFDocument;
