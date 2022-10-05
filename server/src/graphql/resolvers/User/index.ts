import { Request } from "express";
import { IResolvers } from "@graphql-tools/utils";
import { DatabaseCollection, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { 
    UserArgs,
    UserBookingsArgs,
    UserBookingsData,
    UserListingsArgs,
    UserListingsData 
} from "./types";

export const userResolvers: IResolvers = {
    Query: {
        user: async (
        _root: undefined,
        { id }: UserArgs,
        { db, req }: { db: DatabaseCollection; req: Request }
        ): Promise<User> => {
        try {
            const user = await db.users.findOne({ _id: id });
    
            if (!user) {
            throw new Error("l'utilisateur est introuvable ( user can't be found )");
            }
    
            const viewer = await authorize(db, req);
    
            if (viewer && viewer._id === user._id) {
            user.authorized = true;
            }
    
            return user;
        } catch (error) {
            throw new Error(`Échec de l'interrogation de l'utilisateur ( Failed to query user ) : ${error}`);
        }
        }
    },
    User: {
        id: (user: User): string => {
        return user._id;
        },
        hasWallet: (user: User): boolean => {
        return Boolean(user.walletId);
        },
        income: (user: User): number | null => {
        return user.authorized ? user.income : null;
        },
        bookings: async ( user: User, { limit, page }: UserBookingsArgs, { db }: { db: DatabaseCollection } ): Promise<UserBookingsData | null> => {
            try {
                if (!user.authorized) {
                return null;
                }
        
                const data: UserBookingsData = {
                total: 0,
                result: []
                };
        
                let cursor = await db.bookings.find({
                _id: { $in: user.bookings }
                });
                data.total = await cursor.count();
        
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);
        
                
                data.result = await cursor.toArray();
        
                return data;
            } catch (error) {
                throw new Error(`Échec de l'interrogation des réservations des utilisateurs( Failed to query user bookings ): ${error}`);
            }
        },
        listings: async (
        user: User,
        { limit, page }: UserListingsArgs,
        { db }: { db: DatabaseCollection }
        ): Promise<UserListingsData | null> => {
        try {
            const data: UserListingsData = {
            total: 0,
            result: []
            };
    
            let cursor = await db.listings.find({
            _id: { $in: user.listings }
            });

            data.total = await cursor.count();
    
            cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
            cursor = cursor.limit(limit);
    
            
            data.result = await cursor.toArray();
    
            return data;
        } catch (error) {
            throw new Error(`Échec de la requête des listes d'utilisateurs ( Failed to query user listings ): ${error}`);
        }
        }
    }
};
