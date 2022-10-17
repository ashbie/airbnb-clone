import { google } from "googleapis";
import { AddressComponent, Client, GeocodeRequest, PlaceType2 } from "@googlemaps/google-maps-services-js";

const oauth2Client = new google.auth.OAuth2(
    process.env.G_CLIENT_ID,
    process.env.G_CLIENT_SECRET,
    `${process.env.PUBLIC_URL}/login`
);

const client = new Client({});

const parseAddress = (addressComponents: AddressComponent[]) => {
    let country = null;
    let admin = null;
    let city = null;
    for(const component of addressComponents) {
        if(component.types.includes(PlaceType2.country)) { country = component.long_name; }
        if(component.types.includes(PlaceType2.administrative_area_level_1)) { admin = component.long_name; }
        if(component.types.includes(PlaceType2.locality) || component.types.includes(PlaceType2.postal_town)) { city = component.long_name; }
    } 

    return { country, admin, city };
};

export const Google = {
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

    logIn: async (code: string) => {
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        // set auth as a global default
        google.options({
            auth: oauth2Client
        });

        const { data } = await google.people({ version: "v1" }).people.get({
            resourceName: "people/me",
            personFields: "emailAddresses,names,photos"
        });
        
        return { user: data };
    },
    geocode: async (address: string) => {  
        const req: GeocodeRequest = { 
            params: {address: address, key: process.env.G_GEOCODE_KEY as string}
        }
        const res = await client.geocode(req); 
        if (res.status < 200 || res.status > 299) { 
            throw new Error("échec du géocodage de l'adresse"); 
        } 
        return parseAddress(res.data.results[0].address_components);
    }
};