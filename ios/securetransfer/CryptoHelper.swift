import Foundation
import CryptoKit

class CryptoHelper {
    static let shared = CryptoHelper()
    private var privateKey = Curve25519.KeyAgreement.PrivateKey()
    private var symmetricKey: SymmetricKey?
    
    var publicKey: Data {
        return privateKey.publicKey.rawRepresentation
    }
    
    func deriveKey(peerPublicKey: Data, salt: Data) throws {
        let peerKey = try Curve25519.KeyAgreement.PublicKey(rawRepresentation: peerPublicKey)
        let sharedSecret = try privateKey.sharedSecretFromKeyAgreement(with: peerKey)
        
        self.symmetricKey = sharedSecret.hkdfDerivedSymmetricKey(
            using: SHA256.self,
            salt: salt,
            sharedInfo: Data(),
            outputByteCount: 32
        )
    }
    
    func encrypt(_ data: Data) throws -> Data {
        guard let key = symmetricKey else { throw  NSError(domain: "Crypto", code: 1) }
        let sealedBox = try AES.GCM.seal(data, using: key)
        return sealedBox.combined!
    }
}
