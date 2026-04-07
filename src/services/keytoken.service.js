'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            // publicKey is binary, convert to string to save into db
            const publicKeyString = publicKey.toString()
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })

            return tokens ? tokens.publicKey : null

        } catch (err) {
            return err
        }
    }
}

module.exports = KeyTokenService