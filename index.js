"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParkingDataStatic = exports.getParkingDataDynamic = void 0;
var https = require("https");
var html = require("node-html-parser");
var UCF_PARKING_URL = 'https://secure.parking.ucf.edu/GarageCount/';
/**
 * Get the raw HTML from our wonderful ucf.edu website.
 *
 * @return {Promise<string>}     Literally just the HTML in plaintext.
 *
 * @async
 */
function getParkingDataRawHTML() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    https.get(UCF_PARKING_URL, function (res) {
                        var body = '';
                        res.on('data', function (chunk) { return body += chunk; });
                        res.on('end', function () { return resolve(body); });
                    }).on('error', function (e) {
                        reject(e);
                        console.error("Error: " + e.message);
                    });
                })];
        });
    });
}
/**
 * Scan the UCF parking garage webpage and parse the information into something useful.
 *
 * @return {Promise<ParkingData[]>}     Parking data for each garage.
 * @async
 */
function getParkingDataDynamic() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
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
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var rawHTML, MAIN_TABLE, table, unix_timestamp, data, _i, _a, row, tr, name_1, _b, available, capacity, e_1;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, getParkingDataRawHTML()];
                            case 1:
                                rawHTML = _c.sent();
                                MAIN_TABLE = '#ctl00_MainContent_gvCounts_DXMainTable';
                                table = html.parse(rawHTML)
                                    .querySelector(MAIN_TABLE);
                                unix_timestamp = ~~(Date.now() / 1000);
                                data = [];
                                for (_i = 0, _a = table.querySelectorAll('>tr').slice(1); _i < _a.length; _i++) {
                                    row = _a[_i];
                                    tr = row.querySelectorAll('td');
                                    name_1 = tr[0].innerText.trim();
                                    _b = tr[1].innerText
                                        .trim()
                                        .split('/')
                                        .map(function (s) { return parseInt(s); }), available = _b[0], capacity = _b[1];
                                    data.push({
                                        name: name_1,
                                        available: available,
                                        capacity: capacity,
                                        timestamp: unix_timestamp
                                    });
                                }
                                resolve(data);
                                return [3 /*break*/, 3];
                            case 2:
                                e_1 = _c.sent();
                                reject(e_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.getParkingDataDynamic = getParkingDataDynamic;
/**
 * Scan the UCF parking garage webpage and parse the information into something useful.
 *
 * @return {Promise<ParkingData[]>}     Parking data for each garage.
 * @async
 */
function getParkingDataStatic() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            /*
             * This version has the garage names mapped to the <td> id where the availability
             * and capacity information is found. This map is hard-coded AKA why it is
             * considered static.
             *
             * NOTE: This version will produce bad results if the ucf devs change the garage
             * order in the table but keep the <td> ids. If the <td> ids are touched at all,
             * then this function _should_ explicitly break, which is what we want.
             */
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var rawHTML, parsed, GARAGE_HTML_MAP, unix_timestamp, data, _i, _a, _b, garageName, tdId, _c, available, capacity, e_2;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, getParkingDataRawHTML()];
                            case 1:
                                rawHTML = _d.sent();
                                parsed = html.parse(rawHTML);
                                GARAGE_HTML_MAP = {
                                    'Garage A': '#ctl00_MainContent_gvCounts_tccell0_2',
                                    'Garage B': '#ctl00_MainContent_gvCounts_tccell1_2',
                                    'Garage C': '#ctl00_MainContent_gvCounts_tccell2_2',
                                    'Garage D': '#ctl00_MainContent_gvCounts_tccell3_2',
                                    'Garage H': '#ctl00_MainContent_gvCounts_tccell4_2',
                                    'Garage I': '#ctl00_MainContent_gvCounts_tccell5_2',
                                    'Garage Libra': '#ctl00_MainContent_gvCounts_tccell6_2'
                                };
                                unix_timestamp = ~~(Date.now() / 1000);
                                data = [];
                                for (_i = 0, _a = Object.entries(GARAGE_HTML_MAP); _i < _a.length; _i++) {
                                    _b = _a[_i], garageName = _b[0], tdId = _b[1];
                                    _c = parsed.querySelector(tdId)
                                        .innerText
                                        .trim()
                                        .split('/')
                                        .map(function (s) { return parseInt(s); }), available = _c[0], capacity = _c[1];
                                    data.push({
                                        name: garageName,
                                        available: available,
                                        capacity: capacity,
                                        timestamp: unix_timestamp
                                    });
                                }
                                resolve(data);
                                return [3 /*break*/, 3];
                            case 2:
                                e_2 = _d.sent();
                                reject(e_2);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.getParkingDataStatic = getParkingDataStatic;
///**
// * Scan the UCF parking garage webpage and parse the information into something useful.
// *
// * @return {Promise<ParkingData[]>}     Parking data for each garage.
// * @async
// */
//module.exports.getParkingData = module.exports.getParkingDataStatic;
