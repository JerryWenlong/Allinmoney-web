define(['jBcrypt', 'MD5', 'jsencrypt'], function (jBcrypt, MD5, jsencrypt) {
	// encrypt for bscript, RSA,MD5
	var _round = 10; // set salt round

	var crypt = {
		//encrypt password 
		//params:
		//  pw: user password.
		//  callback: encrypt success function. 
		//  progress: progress function(optional)
		cryptPasswordSync: function(pw, salt){
			if(!salt || salt==""){
				var salt = jBcrypt.genSaltSync(_round);
			}
			var hash_str = jBcrypt.hashSync(pw, salt);
			return [hash_str, salt];
		},
		generateMD5Sync: function(pw, salt, random_key){
			var hash_str = this.cryptPasswordSync(pw, salt)[0];
			var md5_result = MD5(hash_str + random_key);
			return md5_result;
		},
		encryptRSA: function(publicKey){
			var encrypt = new JSEncrypt();
			encrypt.setPublicKey(publicKey);
			return encrypt.encrypt(publicKey);
		},
	}

	return crypt;
})