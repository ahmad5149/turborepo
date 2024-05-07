//enums

const ContactAddressType = {
    Home: "Home",
    Work: "Work",
    Delivery: "Delivery"
};

const NamePartType = {
    Full: "Full",
    First: "First",
    Middle: "Middle",
    Suffix: "Suffix",
    Last: "Last"
};

const NameType = {
    Individual: "Individual",
    Business: "Business"
};

const PhoneTime = {
    NoPreference: "NoPreference",
    Morning: "Morning",
    Afternoon: "Afternoon",
    Evening: "Evening",
    Day: "Day"
};

const PhoneType = {
    Phone: "Phone",
    Fax: "Fax",
    Cellphone: "Cellphone",
    Pager: "Pager"
};

const ProspectStatus = {
    New: "New",
    Resend: "Resend"
};
const VehicleCondition = {
    Unknown: "Unknown",
    Excellent: "Excellent",
    Good: "Good",
    Fair: "Fair",
    Poor: "Poor"
};
const FinanceAmountLimit = {
    DownPayment: "DownPayment",
    Monthly: "Monthly",
    Total: "Total"
};

const FinanceAmountType = {
    Maximum: "Maximum",
    Minimum: "Minimum",
    Exact: "Exact"
};
const FinanceBalanceType = {
    Residual: "Residual",
    Finance: "Finance"
};
const VehicleInterest = {
    Buy: "Buy",
    Lease: "Lease",
    Sell: "Sell",
    TradeIn: "TradeIn",
    TestDrive: "TestDrive"
};
const VehicleOdometerStatus = {
    Unknown: "Unknown",
    Rolledover: "Rolledover",
    Replaced: "Replaced",
    Original: "Original"
};
const VehicleOdometerUnits = {
    Mi: "Mi",
    Km: "Km"
};
const PriceDelta = {
    Absolute: "Absolute",
    Relative: "Relative",
    Percentage: "Percentage"
};
const PriceRelativeTo = {
    Msrp: "Msrp",
    Invoice: "Invoice"
};
const PriceType = {
    Quote: "Quote",
    Offer: "Offer",
    Msrp: "Msrp",
    Invoice: "Invoice",
    Call: "Call",
    Appraisal: "Appraisal",
    Asking: "Asking"
};
const VehicleStatus = {
    New: "New",
    Used: "Used"
};
// models
class ContactAddress {
    constructor(apartment, city, country, postalCode, regionCode, streetLines, type) {
        this.Apartment = apartment || "";
        this.City = city || "";
        this.Country = country || "";
        this.PostalCode = postalCode || "";
        this.RegionCode = regionCode || "";
        this.StreetLines = streetLines || [];
        this.Type = type || null;
    }
}

class Email {
    constructor(preferredContact, value) {
        this.PreferredContact = typeof preferredContact === "boolean" ? preferredContact : null;
        this.Value = typeof value === "string" ? value : "";
    }
}

class Name {
    constructor(namePart, type, value) {
        this.NamePart = namePart || null; // Assuming NamePart is another model/class
        this.Type = type || null; // Assuming NameType is another model/class
        this.Value = value || "";
    }
}

class Phone {
    constructor(preferredContact, time, type, value) {
        this.PreferredContact = typeof preferredContact === "boolean" ? preferredContact : null;
        this.Time = time || null; // Assuming PhoneTime is another model/class
        this.Type = type || null; // Assuming PhoneType is another model/class
        this.Value = value || "";
    }
}

class Contact {
    constructor(address, email, names, phoneNumbers, primaryContact) {
        this.Address = address || null; // Assuming ContactAddress is another model/class
        this.Email = email || null; // Assuming Email is another model/class
        this.Names = Array.isArray(names) ? names : [];
        this.PhoneNumbers = Array.isArray(phoneNumbers) ? phoneNumbers : [];
        this.PrimaryContact = typeof primaryContact === "boolean" ? primaryContact : null;
    }
}
class Id {
    constructor(leadId, source) {
        this.LeadId = leadId || "";
        this.Source = source || "";
    }
}
class Timeframe {
    constructor(description, earliestDate, latestDate) {
        this.Description = description || "";
        this.EarliestDate = earliestDate || null;
        this.LatestDate = latestDate || null;
    }
}

class Customer {
    constructor(comments, contact, ids, timeframe) {
        this.Comments = comments || "";
        this.Contact = contact || null; // Assuming Contact is another model/class
        this.Ids = Array.isArray(ids) ? ids : [];
        this.Timeframe = timeframe || null; // Assuming Timeframe is another model/class
    }
}

class Prospect {
    constructor(ids, requestDate, status) {
        this.Ids = Array.isArray(ids) ? ids : [];
        this.RequestDate = requestDate || null;
        this.Status = status || null; // Assuming ProspectStatus is another model/class
    }
}
class Provider {
    constructor(contact, email, ids, names, phone, service, url) {
        this.Contact = contact || null; // Assuming Contact is another model/class
        this.Email = email || null; // Assuming Email is another model/class
        this.Ids = Array.isArray(ids) ? ids : [];
        this.Names = Array.isArray(names) ? names : [];
        this.Phone = phone || null; // Assuming Phone is another model/class
        this.Service = service || "";
        this.Url = url || "";
    }
}

class ColorCombination {
    constructor(exteriorColor, interiorColor) {
        this.ExteriorColor = exteriorColor || "";
        this.InteriorColor = interiorColor || "";
    }
}
class FinanceAmount {
    constructor(amount, currency, limit, type) {
        this.Amount = amount || "";
        this.Currency = currency || "";
        this.Limit = limit || null; // Assuming FinanceAmountLimit is an enum
        this.Type = type || null; // Assuming FinanceAmountType is an enum
    }
}

class FinanceBalance {
    constructor(amount, currency, type) {
        this.Amount = amount || "";
        this.Currency = currency || "";
        this.Type = type || null; // Assuming FinanceBalanceType is an enum
    }
}

class Finance {
    constructor(amounts, balance, method) {
        this.Amounts = Array.isArray(amounts) ? amounts : [];
        this.Balance = balance || null; // Assuming FinanceBalance is another model/class
        this.Method = method || "";
    }
}

class ImageTag {
    constructor(altText, height, url, width) {
        this.AltText = altText || "";
        this.Height = height || "";
        this.Url = url || "";
        this.Width = width || "";
    }
}

class Odometer {
    constructor(status, unit, value) {
        this.Status = status || null; // Assuming VehicleOdometerStatus is an enum
        this.Unit = unit || null; // Assuming VehicleOdometerUnits is an enum
        this.Value = value || "";
    }
}

class Price {
    constructor(currency, priceDelta, priceRelativeTo, priceType, source, value) {
        this.Currency = currency || "";
        this.PriceDelta = priceDelta || null; // Assuming PriceDelta is an enum
        this.PriceRelativeTo = priceRelativeTo || null; // Assuming PriceRelativeTo is an enum
        this.PriceType = priceType || PriceType.Quote; // Default to Quote if not provided
        this.Source = source || "";
        this.Value = value || "";
    }
}

class Option {
    constructor(manufacturerCode, optionName, price, stock, weighting) {
        this.ManufacturerCode = manufacturerCode || "";
        this.OptionName = optionName || "";
        this.Price = price || null; // Assuming Price is another model/class
        this.Stock = stock || "";
        this.Weighting = weighting || null;
    }
}

class Vehicle {
    constructor(
        bodyStyle,
        colorCombinations,
        comments,
        condition,
        doors,
        finance,
        ids,
        imageTag,
        interest,
        make,
        model,
        odometer,
        options,
        price,
        priceComments,
        status,
        stockNumber,
        transmission,
        trim,
        vin,
        year
    ) {
        this.BodyStyle = bodyStyle || "";
        this.ColorCombinations = colorCombinations || []; // Assuming it's an array of ColorCombination instances
        this.Comments = comments || "";
        this.Condition = condition || null; // Assuming VehicleCondition is an enum
        this.Doors = doors || "";
        this.Finance = finance || null; // Assuming it's a Finance instance
        this.Ids = ids || []; // Assuming it's an array of Id instances
        this.ImageTag = imageTag || null; // Assuming it's an ImageTag instance
        this.Interest = interest || null; // Assuming VehicleInterest is an enum
        this.Make = make || "";
        this.Model = model || "";
        this.Odometer = odometer || null; // Assuming it's an Odometer instance
        this.Options = options || []; // Assuming it's an array of Option instances
        this.Price = price || null; // Assuming it's a Price instance
        this.PriceComments = priceComments || "";
        this.Status = status || VehicleStatus.New; // Default to New if not provided
        this.StockNumber = stockNumber || "";
        this.Transmission = transmission || "";
        this.Trim = trim || "";
        this.Vin = vin || "";
        this.Year = year || "";
    }
}
class Vendor {
    constructor(contact, ids, url, vendorName) {
        this.Contact = contact || null; // Assuming it's a Contact instance
        this.Ids = ids || []; // Assuming it's an array of Id instances
        this.Url = url || "";
        this.VendorName = vendorName || "";
    }
}
class AdfLead {
    constructor(customer, prospect, provider, vehicles, vendor) {
        this.Customer = customer || null; // Assuming it's a Customer instance
        this.Prospect = prospect || null; // Assuming it's a Prospect instance
        this.Provider = provider || null; // Assuming it's a Provider instance
        this.Vehicles = vehicles || null; // Assuming it's an array of Vehicle instances or null
        this.Vendor = vendor || null; // Assuming it's a Vendor instance
    }
}
export {
    ContactAddressType,
    NamePartType,
    NameType,
    PhoneTime,
    PhoneType,
    ProspectStatus,
    VehicleCondition,
    FinanceAmountType,
    FinanceAmountLimit,
    FinanceBalanceType,
    VehicleInterest,
    VehicleOdometerStatus,
    VehicleOdometerUnits,
    PriceDelta,
    PriceRelativeTo,
    PriceType,
    VehicleStatus,
    ContactAddress,
    Email,
    Name,
    Phone,
    Contact,
    Id,
    Timeframe,
    Customer,
    Prospect,
    Provider,
    ColorCombination,
    FinanceAmount,
    FinanceBalance,
    Finance,
    ImageTag,
    Odometer,
    Price,
    Option,
    Vehicle,
    Vendor,
    AdfLead
};
