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
exports.listingsResolvers = void 0;
const mongodb_1 = require("mongodb");
exports.listingsResolvers = {
    Query: {
        listings: (_root, _args, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield db.listings.find({}).toArray();
        })
    },
    Mutation: {
        deleteListing: (_root, { id }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const deleteResult = yield db.listings.findOneAndDelete({ _id: new mongodb_1.ObjectId(id) });
            if (!deleteResult.value) {
                throw new Error('[deleteListing] : failed to delete listing!!!');
            }
            return deleteResult.value;
        })
    },
    Listing: {
        id: (listing) => { return listing._id.toString(); }
    }
};
