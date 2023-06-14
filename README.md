# Car sharing

## Short Description

Create minimal web service using native Node.js HTTP module. It should support Get, Post, Put and Delete methods for manipulating with car sharing service data.

## Topics

1. MongoDb
2. Mongoose

## Requirements

1. Create MongoDb instance __car-sharing__ that contains collection __cars__. Each document of the collection should represent single car in vehicle park. Here is the schema for the car document:
    - VIN (Vehicle identification number)
    - Registration number
    - Production info
       * Brand
       * Model
       * Date
    - Status (Free, Reserved, In use, Unavailable, In Service, ...)
    - Fuel level (litres, percents or part of full)
    - Mileage (km)
    - Current run
     * Start date
     * Driver
        * License number
        * First name
        * Last name
        * Credit/debit card
          * Number
          * Owner (First and Last name)
          * Valid through (date)
     * Start fuel level
     * Start milage (km)
    - Location (GeoJSON)
    - Bookings history (the same structure as for the current run, and additionally)
      * Finish fuel level
      * Finish milage (km)

Add at least 5 various car records(use different values from enumerations for populating fields). Keep in mind that some of the fields could be *nullable*, other must have default values.

2. Init and configure Node.js project, install [Mongoose](https://www.npmjs.com/package/mongoose) NPM package. Create __Car__ model using schema and sub-schemas(optionally) that describes *car* document structure (Set field types, default values if needed).

3. Install [Express](https://www.npmjs.com/package/express). Create simple web api that can accept next requests (and answer with appropriate responses):
   - __Get__ http request to obtain list of cars that are currently in use and fuel level less than 1/4 of full tank
   - __Get__ http request to obtain all cars that has been reserved, but driver credit/debit card hasn't been authorized. Return VIN, location, driver first/last name and driver license number.
   - __Post__ http request to add new car in the car sharing park.
   - __Put__ http request to update any car produced before '01/01/2017' or has mileage greater than 100000 km by setting Status to *In Service*.
   - __Put__ http request to update any car that has been booked more than 2 times and aren't *In use* or *Reserved* by setting location coordinates to { latitude: 53.8882836, longitude: 27.5442615}
   - __Delete__ http request to remove car by VIN
