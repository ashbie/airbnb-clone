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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Google = void 0;
const googleapis_1 = require("googleapis");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET, `${process.env.PUBLIC_URL}/login`);
const client = new google_maps_services_js_1.Client({});
const parseAddress = (addressComponents) => {
    let country = null;
    let admin = null;
    let city = null;
    for (const component of addressComponents) {
        if (component.types.includes(google_maps_services_js_1.PlaceType2.country)) {
            country = component.long_name;
        }
        if (component.types.includes(google_maps_services_js_1.PlaceType2.administrative_area_level_1)) {
            admin = component.long_name;
        }
        if (component.types.includes(google_maps_services_js_1.PlaceType2.locality) || component.types.includes(google_maps_services_js_1.PlaceType2.postal_town)) {
            city = component.long_name;
        }
    }
    return { country, admin, city };
};
exports.Google = {
    authUrl: oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        /*     // eslint-disable-next-line @typescript-eslint/camelcase */
        access_type: 'online',
        // If you only need one scope you can pass it as a string
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ],
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true
    }),
    logIn: (code) => __awaiter(void 0, void 0, void 0, function* () {
        const { tokens } = yield oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // set auth as a global default
        googleapis_1.google.options({
            auth: oauth2Client
        });
        const { data } = yield googleapis_1.google.people({ version: "v1" }).people.get({
            resourceName: "people/me",
            personFields: "emailAddresses,names,photos"
        });
        return { user: data };
    }),
    geocode: (address) => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            params: { address: address, key: process.env.G_GEOCODE_KEY }
        };
        const res = yield client.geocode(req);
        if (res.status < 200 || res.status > 299) {
            throw new Error("échec du géocodage de l'adresse");
        }
        return parseAddress(res.data.results[0].address_components);
    })
};
