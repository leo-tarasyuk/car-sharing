import request from 'supertest';
import app from "../../index";
// import mongoose, { Connection } from "mongoose";

// import { ICreateCar } from '../../src/dto/car.dto';
// import { LocationType } from '../../src/dto/location.dto';
// import { GeometryType } from '../../src/dto/geometry.dto';

// const mockCar: ICreateCar = {
//     "vin": "1232132132132132131",
//     "registration_number": 9379992,
//     "fuel_level": 37,
//     "mileage": 100002,
//     "model": {
//         "brand": "Audi",
//         "model": "A8",
//         "date": new Date()
//     },
//     "location": {
//         "type": LocationType.Feature,
//         "geometry": {
//             "type": GeometryType.Point,
//             "coordinates": [
//                 53.88,
//                 27.54
//             ]
//         }
//     }
// }

describe('CarController', () => {
    // it("should create a new car", async () => {
    //     const response = await request(app)
    //         .post(`/car`)
    //         .send(mockCar);
        
    //     expect(response.status).toBe(200);
    //     expect(response.body).toMatchObject({
    //         _id: expect.any(String),
    //         __v: expect.any(Number),
    //         ...mockCar,
    //     });
    // }, 10000);

    it("should get a car", async () => {
        const carId = '64e4fa56d29ec9b0d42a2b7f'
        const response = await request(app).get(`/car/${carId}`)

        expect(response.status).toBe(200);
        // expect(response.body).toMatchObject({
        //     _id: expect.any(String),
        //     __v: expect.any(Number),
        //     ...mockCar,
        // });
    }, 100000);
})