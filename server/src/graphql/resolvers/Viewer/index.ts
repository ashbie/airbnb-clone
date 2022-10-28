import crypto from "crypto";
import { Request, Response } from "express"
import { IResolvers } from "@graphql-tools/utils";
import { Google, Stripe } from "../../../lib/api";
import { DatabaseCollection, Viewer, User } from "../../../lib/types";
import { LogInArgs, ConnectStripeArgs } from "./types";
import { authorize } from "../../../lib/utils";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true
};

const logInViaGoogle = async (
    code: string,
    token: string,
    db: DatabaseCollection,
    res: Response
  ): Promise<User | undefined> => {
    const { user } = await Google.logIn(code);
  
    if (!user) {
      throw new Error("Google login error");
    }
  
    // Name/Photo/Email Lists
    const userNamesList = user.names && user.names.length ? user.names : null;
    const userPhotosList = user.photos && user.photos.length ? user.photos : null;
    const userEmailsList =
      user.emailAddresses && user.emailAddresses.length
        ? user.emailAddresses
        : null;
  
    // User Display Name
    const userName = userNamesList ? userNamesList[0].displayName : null;
  
    // User Id
    const userId =
      userNamesList &&
      userNamesList[0].metadata &&
      userNamesList[0].metadata.source
        ? userNamesList[0].metadata.source.id
        : null;
  
    // User Avatar
    const userAvatar =
      userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;
  
    // User Email
    const userEmail =
      userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;
  
    if (!userId || !userName || !userAvatar || !userEmail) {
      throw new Error("Google login error");
    }
  
    const updateRes = await db.users.findOneAndUpdate(
        { _id: userId },
        {
            $set: {
                name: userName,
                avatar: userAvatar,
                contact: userEmail,
                token
            }
        },
        {returnDocument: "after"}
        
    );
 

    let viewer = updateRes.value;
  
    if (!viewer) {
      const newUser = {
        _id: userId,
        token,
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        income: 0,
        bookings: [],
        listings: []
      };
  
      await db.users.insertOne(newUser);
      viewer = newUser;
    }

    res.cookie("viewer", userId, {
      ...cookieOptions,
      maxAge: 365 * 24 * 60 * 60 * 1000
    });
  
    return viewer;
  };

  const logInViaCookie = async (
    token: string,
    db: DatabaseCollection,
    req: Request,
    res: Response
  ): Promise<User | undefined> => {
    const updateRes = await db.users.findOneAndUpdate(
      { _id: req.signedCookies.viewer },
      { $set: { token } },
      { returnDocument: "after" }
    );
  
    const viewer = updateRes.value;
  
    if (!viewer) {
      res.clearCookie("viewer", cookieOptions);
      return undefined;
    }
  
    return viewer;
  };

export const viewerResolvers: IResolvers = {
    Query: {
        authUrl: () => {
            try {
                return Google.authUrl;
            } catch (error) {
                throw new Error(`Échec de la requête de l'URL d'authentification Google : ${error}`);
            }
        }
    },
    Mutation: {
        logIn: async (_root: undefined, { input }: LogInArgs, { db, req, res }: { db: DatabaseCollection; req: Request; res: Response }): Promise<Viewer> => {
           try {
            const code = input ? input.code : null ;
            const token = crypto.randomBytes(16).toString("hex");

            const viewer = code? await logInViaGoogle(code, token, db, res): await logInViaCookie(token, db, req, res);

            if (!viewer) {
                return { didRequest: true };
              }
      
              return {
                _id: viewer._id,
                token: viewer.token,
                avatar: viewer.avatar,
                walletId: viewer.walletId,
                didRequest: true
              };
           } catch (error) {
            throw new Error(`Failed to log in: ${error}`);
           }
        },
        logOut: (_root: undefined, _args: Record<string, never>, { res }: { res: Response }): Viewer => {
          // I'm using ( ..., _args: Record<string, never>, ... ) to mean empty object because if I use ( ..., _args: {}, ... ) I get a tyescript-eslint warning
          try {
            res.clearCookie("viewer", cookieOptions);
            return { didRequest: true };
          } catch (error) {
            throw new Error(`Failed to log out: ${error}`);
          }
        },
        connectStripe: async (
          _root: undefined,
          { input }: ConnectStripeArgs,
          { db, req }: { db: DatabaseCollection; req: Request }
        ): Promise<Viewer> => {
          try {
            const { code } = input;
    
            let viewer = await authorize(db, req);
            if (!viewer) {
              throw new Error("spectateur( i.e. viewer ) introuvable");
            }
    
            const wallet = await Stripe.connect(code);
            if (!wallet) {
              throw new Error("Erreur d'accorder venant de Stripe");
            }
    
            const updateRes = await db.users.findOneAndUpdate(
              { _id: viewer._id },
              { $set: { walletId: wallet.stripe_user_id } },
              {returnDocument: "after"}
            );
    
            if (!updateRes.value) {
              throw new Error("la visionneuse( i.e. viewer ) n'a pas pu être mise à jour");
            }
    
            viewer = updateRes.value;
    
            return {
              _id: viewer._id,
              token: viewer.token,
              avatar: viewer.avatar,
              walletId: viewer.walletId,
              didRequest: true
            };
          } catch (error) {
            throw new Error(`Échec de la connexion avec Stripe: ${error}`);
          }
        },
        disconnectStripe: async (
          _root: undefined,
          _args: Record<string, never>,
          { db, req }: { db: DatabaseCollection; req: Request }
        ): Promise<Viewer> => {
          try {
            let viewer = await authorize(db, req);
            if (!viewer) {
              throw new Error("spectateur( i.e. viewer ) introuvable");
            }
    
            const updateRes = await db.users.findOneAndUpdate(
              { _id: viewer._id },
              { $set: { walletId: undefined } },
              {returnDocument: "after"}
            );
    
            if (!updateRes.value) {
              throw new Error("la visionneuse( i.e. viewer ) n'a pas pu être mise à jour");
            }
    
            viewer = updateRes.value;
    
            return {
              _id: viewer._id,
              token: viewer.token,
              avatar: viewer.avatar,
              walletId: viewer.walletId,
              didRequest: true
            };
          } catch (error) {
            throw new Error(`Échec de la connexion avec Stripe: ${error}`);
          }
        }

    },
    Viewer: {
        id: (viewer: Viewer): string | undefined => {
            return viewer._id;
        },
        hasWallet: (viewer: Viewer): boolean | undefined => {
            return viewer.walletId ? true : undefined;
        }
    }
    
}