import https = require('https');
import http = require('http');
import html = require('node-html-parser');

const UCF_PARKING_URL = 'https://secure.parking.ucf.edu/GarageCount/';

/**
 * Get the raw HTML from our wonderful ucf.edu website.
 * 
 * @return {Promise<string>}     Literally just the HTML in plaintext.
 *
 * @async
 */
async function getParkingDataRawHTML():Promise<string> {
   return new Promise<string>((resolve, reject) => {
      https.get(UCF_PARKING_URL, res => {
         let body = '';
         res.on('data', (chunk: string) => body += chunk);
         res.on('end', () => resolve(body));
      }).on('error', (e: Error) => {
         reject(e);
         console.error(`Error: ${e.message}`);
      });
   });
}

/**
 * Unix timestamp are precise to seconds rather than milli/nanoseconds.
 */
export type UnixTimestamp = number;

/**
 * This is basically what we store in the database.
 * @prop {string} name              Name of the garage. Might be changed to an enum type in the future because it should be the exact name of the garage as found in the db.
 * @prop {number} available         Number of available parking spots.
 * @prop {number} capacity          Parking capacity of the garage.
 * @prop {UnixTimestamp} timestamp  Timestamp for when the data was acccessed.
 */
export type ParkingData = {
   name: string,
   available: number,
   capacity: number,
   timestamp: UnixTimestamp
};

/**
 * Scan the UCF parking garage webpage and parse the information into something useful.
 *
 * @return {Promise<ParkingData[]>}     Parking data for each garage.
 * @async
 */
export async function getParkingDataDynamic():Promise<ParkingData[]> {
   /*
    * This version has the garage names dynamically mapped to its availability
    * and capacity information. AKA considered dynamically.
    * 
    * NOTE: If the ucf devs decide to change the names of the garages, then a program
    * depending on this function might still break either way, which is why this isn't
    * the clear cut choice.
    * Also, it can still break if the HTML is changed. A hybrid static + dynamic
    * function might be the best choice to ensure it breaks when it needs to.
    */
   return new Promise<ParkingData[]>(async (resolve, reject) => {
      try {
         const rawHTML = await getParkingDataRawHTML();
         const MAIN_TABLE = '#ctl00_MainContent_gvCounts_DXMainTable';
         const table = html.parse(rawHTML)
                           .querySelector(MAIN_TABLE);
         const unix_timestamp = ~~(Date.now() / 1000);

         // Parse the parking data from the parsed HTML table.
         let data: ParkingData[] = [];
         for (const row of table.querySelectorAll('>tr').slice(1)) {
            const tr = row.querySelectorAll('td');
            const name = tr[0].innerText.trim();
            const [available, capacity] = tr[1].innerText
                                               .trim()
                                               .split('/')
                                               .map(s => parseInt(s));

            data.push({
               name: name,
               available: available,
               capacity: capacity,
               timestamp: unix_timestamp
            });

         }

         resolve(data);
      }
      catch (e) {
         reject(e);
      }
   });
}

/**
 * Scan the UCF parking garage webpage and parse the information into something useful.
 *
 * @return {Promise<ParkingData[]>}     Parking data for each garage.
 * @async
 */
export async function getParkingDataStatic():Promise<ParkingData[]> {
   /*
    * This version has the garage names mapped to the <td> id where the availability
    * and capacity information is found. This map is hard-coded AKA why it is
    * considered static.
    * 
    * NOTE: This version will produce bad results if the ucf devs change the garage
    * order in the table but keep the <td> ids. If the <td> ids are touched at all,
    * then this function _should_ explicitly break, which is what we want.
    */
   return new Promise<ParkingData[]>(async (resolve, reject) => {
      try {
         const rawHTML = await getParkingDataRawHTML();
         const parsed = html.parse(rawHTML);
         // 
         const GARAGE_HTML_MAP = {
            'Garage A': '#ctl00_MainContent_gvCounts_tccell0_2',
            'Garage B': '#ctl00_MainContent_gvCounts_tccell1_2',
            'Garage C': '#ctl00_MainContent_gvCounts_tccell2_2',
            'Garage D': '#ctl00_MainContent_gvCounts_tccell3_2',
            'Garage H': '#ctl00_MainContent_gvCounts_tccell4_2',
            'Garage I': '#ctl00_MainContent_gvCounts_tccell5_2',
            'Garage Libra': '#ctl00_MainContent_gvCounts_tccell6_2'
         };
         const unix_timestamp = ~~(Date.now() / 1000);


         // Parse the parking data from the HTML.
         let data: ParkingData[] = [];
         for (const [garageName, tdId] of Object.entries(GARAGE_HTML_MAP)) {
            const [available, capacity] = parsed.querySelector(tdId)
                                                .innerText
                                                .trim()
                                                .split('/')
                                                .map(s => parseInt(s));
            data.push({
               name: garageName,
               available: available,
               capacity: capacity,
               timestamp: unix_timestamp
            });
         }

         resolve(data);
      }
      catch (e) {
         reject(e);
      }
   });
}

