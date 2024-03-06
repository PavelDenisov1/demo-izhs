class Hash {
    static base64Uint8Array(bytes) {
      var base64 = '';
      var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
      var byteLength = bytes.byteLength;
      var byteRemainder = byteLength % 3;
      var mainLength = byteLength - byteRemainder;
  
      var a, b, c, d;
      var chunk;
  
      // Main loop deals with bytes in chunks of 3
      for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
  
        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1
  
        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
      }
  
      // Deal with the remaining bytes and padding
      if (byteRemainder === 1) {
        chunk = bytes[mainLength];
  
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
  
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
  
        base64 += encodings[a] + encodings[b] + '==';
      } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
  
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
  
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
  
        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
      }
  
      return base64;
    }
  
    static SHA1(msg) {
      function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
      }
  
      function cvt_hex(val) {
        var str = '';
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
          v = (val >>> (i * 4)) & 0x0f;
          str += v.toString(16);
        }
        return str;
      }
  
      function Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else if (c < 0xd800 || c >= 0xe000) {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            c = 0x10000 + (((c & 0x3ff) << 10) | (string.charCodeAt(++n) & 0x3ff));
            utftext += String.fromCharCode(0xf0 | (c >> 18));
            utftext += String.fromCharCode(0x80 | ((c >> 12) & 0x3f));
            utftext += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
            utftext += String.fromCharCode(0x80 | (c & 0x3f));
          }
        }
        return utftext;
      }
      var blockstart;
      var i, j;
      var W = [80];
      var H0 = 0x67452301;
      var H1 = 0xefcdab89;
      var H2 = 0x98badcfe;
      var H3 = 0x10325476;
      var H4 = 0xc3d2e1f0;
      var A, B, C, D, E;
      var temp;
      msg = Utf8Encode(msg);
      var msg_len = msg.length;
      var word_array = [];
      for (i = 0; i < msg_len - 3; i += 4) {
        j =
          (msg.charCodeAt(i) << 24) |
          (msg.charCodeAt(i + 1) << 16) |
          (msg.charCodeAt(i + 2) << 8) |
          msg.charCodeAt(i + 3);
        word_array.push(j);
      }
      switch (msg_len % 4) {
        case 0:
          i = 0x080000000;
          break;
        case 1:
          i = (msg.charCodeAt(msg_len - 1) << 24) | 0x0800000;
          break;
        case 2:
          i = (msg.charCodeAt(msg_len - 2) << 24) | (msg.charCodeAt(msg_len - 1) << 16) | 0x08000;
          break;
        case 3:
          i =
            (msg.charCodeAt(msg_len - 3) << 24) |
            (msg.charCodeAt(msg_len - 2) << 16) |
            (msg.charCodeAt(msg_len - 1) << 8) |
            0x80;
          break;
        default:
          break;
      }
      word_array.push(i);
      while (word_array.length % 16 !== 14) word_array.push(0);
      word_array.push(msg_len >>> 29);
      word_array.push((msg_len << 3) & 0x0ffffffff);
      for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
          temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B, 30);
          B = A;
          A = temp;
        }
        for (i = 20; i <= 39; i++) {
          temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B, 30);
          B = A;
          A = temp;
        }
        for (i = 40; i <= 59; i++) {
          temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8f1bbcdc) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B, 30);
          B = A;
          A = temp;
        }
        for (i = 60; i <= 79; i++) {
          temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B, 30);
          B = A;
          A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
      }
      temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  
      return temp.toLowerCase();
    }
  }
  
  export default Hash;
  