import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.G_CLIENT_ID,
    process.env.G_CLIENT_SECRET,
    `${process.env.PUBLIC_URL}/login`
);

export const Google = {
    authUrl: oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        /*     // eslint-disable-next-line @typescript-eslint/camelcase */
        access_type: 'online',
      
        // If you only need one scope you can pass it as a string
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
          ]
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
    }
};