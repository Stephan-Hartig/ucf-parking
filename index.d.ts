/**
 * Unix timestamp are precise to seconds rather than milli/nanoseconds.
 */
export declare type UnixTimestamp = number;
/**
 * This is basically what we store in the database.
 * @prop {string} name              Name of the garage. Might be changed to an enum type in the future because it should be the exact name of the garage as found in the db.
 * @prop {number} available         Number of available parking spots.
 * @prop {number} capacity          Parking capacity of the garage.
 * @prop {UnixTimestamp} timestamp  Timestamp for when the data was acccessed.
 */
export declare type ParkingData = {
    name: string;
    available: number;
    capacity: number;
    timestamp: UnixTimestamp;
};
/**
 * Scan the UCF parking garage webpage and parse the information into something useful.
 *
 * @return {Promise<ParkingData[]>}     Parking data for each garage.
 * @async
 */
export declare function getParkingDataDynamic(): Promise<ParkingData[]>;
/**
 * Scan the UCF parking garage webpage and parse the information into something useful.
 *
 * @return {Promise<ParkingData[]>}     Parking data for each garage.
 * @async
 */
export declare function getParkingDataStatic(): Promise<ParkingData[]>;
