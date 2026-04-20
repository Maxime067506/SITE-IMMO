/* ============================================================
   Delfosse Properties — Authentification voyageurs (mode sécurisé)

   Chaque profil est chiffré AES-256-GCM avec une clé dérivée du
   mot de passe du voyageur (PBKDF2-SHA256, 200 000 itérations,
   sel unique par utilisateur).

   Sans le mot de passe, les données (Wi-Fi, codes, téléphones,
   numéros Airbnb, etc.) sont IMPOSSIBLES à lire — même avec
   accès au code source.

   Pour ajouter/modifier un utilisateur :
   → éditer tools/encrypt-users.js (dossier non versionné)
   → lancer `node tools/encrypt-users.js`
   → copier le bloc DP_USERS_ENC généré ici-même
   ============================================================ */

const DP_USERS_ENC = {
  "martin": {
    "salt": "R2o4Skfw4X+ambX4FwurwA==",
    "iv": "QhUjmBsZiEU+3Zpg",
    "data": "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"
  },
  "nguyen": {
    "salt": "J2I7i2oNxe6JWN8E1dux2Q==",
    "iv": "X+y8Db5Q3CIyCdxo",
    "data": "fTZjzSdAyMJCnmvyGAzsbTwhNVUMLnrT8cDwRmxL2ttIIJEOjcgqdCKRL/d3BfOmnnygorImHivF8kAuVAQzgK7k/sp9GJhi9oyKDYuCJvA/Hn+zct33KRyvgSfYlC3KaFJOumdU7daMhrd3QOYMq2bbR+OHNP8pwqoqnDN3RntqHbKP1WXmYvDzd2Iy8FYh4Vp2Q/B7s4IIB0yQpGvB8eFZQxkMSE+IvsDIZE+wVZmFgNWR9UjcWx7JevUGV0F5SZ4wJXH334ykJUsjHAGBseiNyRsxlmEoyWfhtc60k/Yvlq9ZH5Lu8+64DEHoThLFMEleEkZNl0MXJVpKg6hhNV/NZqVwbf5gBWN7OaaJsQpLsopHHfK5bKFxbSvnd2YsfqVq+09+05xEbKQh4LHh/lx9nKT5TgcMAhhoZ0tUlpYcu7dMJ2Ie2fDj/MQCIYYR8ahKDHtWGocyd7kfKsvsAXsX69yZ5g2X7H39y+lGhci2PhK8UrZMS/whENndk1DPsbqayFc7HEsA6nPh5tLbywW2aC6CYh8NRNZgKc9VMSwSRiG06bPUTZ3rfQRbT2WZnZ7eiu1cp8OIrdm7KOt1CJiXthibOFSGb3vF/xBz9aOs8TWhgTRkfYi5fI3X++L3eLZU6C+VO0+WGc9ZgLCPlt1TKmOXnmUphysY2bYvUXvLipRK6dWIfbD/kjnNsYTiZPDbDpNgZmn6+ilLwSZ38iQNPvLcoRGwqkRk6SR1mF3FfvJr0bM4zl/Glo2OuW11ihloWchHnWUGmOAR2qwujrvUXBAbINnTjTNU3Lk5d4unwBzsuMHJIlQpyjs95SsNB9vhPFmGVj1xxkML+JeCmwSJhomzkM+UeBa+P9yn7fCeGXtiLwAPJF+rKNtF0j22aOED7VoROk4qoGd0HbbmDYqNzfZrTsXLQtaEZd+NTB1Xi/M51dWUonT5pDlX0EHczKSXuTJisw19bPMC3qYeRiakWxG9mouZ83+2qR7mVcupqGpKxXjPjdI2qWEPkUC5AIpquJGxxVGcUpRSHQ10LRfuTTFVOYftAUWGxB3jTTTl8yQKEcHQBxOIiirV5Y1YV7rxed6OswB1BuYPM2k3bLvu+YYzMKvblSBSqJ5oEJ5oxKFEetnewkE/JB8XU+WgTuEbtKCa/qx/zJHmc9L37PuFNfKY7u7FxHZAvgPwJUMyIj2D"
  },
  "dupont": {
    "salt": "16KfGyWR4MVTnKzuxGQZsA==",
    "iv": "U8GMfFm+DkXB6fnG",
    "data": "ZDzLYdkmh3DtURbx6hCQS/oUj6ASYfIQoGS0K4f3TbND9NkNyDCuWKngjIXnWkt9jF8sUrawftJggGHqupSMPbqO57xrPHcDytS7ZiqCcZWcJcdmpFzQRlvBWkOrF2o23D2RBFF8t2CQXgE8kme1AB0n0cQIhujC/sVGC2xodpHedmZGgZlaq5SXrBXDXru70OPuet3JsXXdn0KGMe1ACwQj2oPOyd8oFQR3Tn1uSNtsVx1EAqCwKr5El7mHaM00hjDsGdsIjVJqm4n2FpmAmV4hse+L+Qt/w7JNZGtl6oMlPu6fOK3zlTlCFNb4MiklA6U4W5q7NlYr0kqRDQvdjHP5RHRsslW5Gd3LhQaLVmR6g4aWZqJhg/BRJXTpwllJzxBZ7dzDsgPA4eiJLXr25hYwqi8GNJSQUAKl2p3v22u3M15hoBdzcaAGqJUzQF5pOdIKQjpCq93snmVoZKVQtwUTeRgrdA5vXbegJquKY+Wj1902oomt4ZftLl/whJaBwa+gE9kz2Yg8cql6sM2dNUxOxLMSS3g+JcGQUX9QmO/YsRWfCsqSWXLu1vHEBlhxaTI42P3ZTg80y8A+hwN1kFFJZLH3korn0qMFYXvsH5FzEH2r2wNsX4apPxj6z3/4X4s+ON4FMMXZmUmuDKAsPX66Z/2xrKTaFq4S0PmeXse7fMniGJ8rmWo3b5lPNnIsW3xF7vegQFw7Cs7nLALofXXECuIPOVHwGvP1bSAcBoacZB9rdKtG8iHJJPSgQWqpoQDgP1EikAKqQxn/5S0zx+UuS9ZcniKEskT181r3x5UoTtpeZuqOiKYaebOFSAYlt199/Jf/g4DPmv3IRPoRLfczyrHw/XxYV1bgBHZHohfSEE+YTdFhCD4Ze9sviQV3TpzcL1UR8NDIysaDKnLIKiVhmlL7OlWn2PhZ3tJXZ4p3G8Kn56SMv82jQ1DPdcB9pTH8QxB/W85BtXRKL4JMkYFi8g+583pKzpNQSNpOqh4GwM1Swgo2V5Y+l3CdnWwgLD2YtkG9cz+AT+oAhvqdi5r5PGDXObKNmJqoJ/Pk8bI4ycPT5tfi7C9T/kWwoeO11SScuzlr+6goJO6Y9z2k4Qn986P8VuFq9VZU4KJtJDcvDggKcMOSTGHgFi0tFckcOmY2kVEev0e7LbWD3fXDPrO5S8gIp6fJovFaFycZlvVs1SIamhFbbh5qKPw="
  },
  "rousseau": {
    "salt": "S/0qPJvgHSS31T5QEdh1rQ==",
    "iv": "BxoutzLK5UaYMK/I",
    "data": "RyShF9QJGtelBqjKJzckqhmMsosQXz4sMhrH1hg4SWyzX0PQnB1hf7PoN6DFu19qOr4TBjvWjAlKcKytbNi0ESieZWHeUt+f2UKgFnSCv5KxmjF5cdoHSjSYONWXFSeawVXkfQu7cl/cNaNq38RNEprtIhHEgTZKgzhZ1Mw8d1iP4eH/Ww+VSCV7TC0JwAyC9ZVSQtpTkfLESr31gGLTnrHvltgprJgTcQZSSn47Eend/MNOltMRGLfz8I+I7bn8kmdLZgiK6SDvwUDSQGlMW3sTWFmoAglBSV2HikBjaynJehj5bBdimofqkewcd/6uqkNh6b621Vp7Z18WAY02ghPjiSxP3+wr0quNyC48yjuShUylHfPltdVQBiekFUfMUdcuOBHGEZAuT66UGWY/EaCCRPPbTOI1WiA/065g0TzRRYGXdw6syi8Q8CdT3CwURiqykHpnVejgN15bvsquAtSI9VcXp4nny4Ya/cMiOEpnk8fp5FIehczhbpq+lDJnazuJ2Y6k0c7Nr0AcRNuKZoZ9huRwrq39gxOxAXCx2Lhf0aSQGS4QLEzYCx0N9JMOF71W5UYaZiDZB0Gpz8mFt1IJ3f735oqdiFx+WNAFHQkXzXmiXcH4YjeMG5arlNbrvSAu6YH3jHsutLl5e+Y4exEmSVuxXyRp600VL6aUJLjA9x0+mjhtmkhvKG8wUq8QogddiuQTzzz/3YoaiFM/cyU59rCpm6gtLBdXhMhzE2fFY5bqMoX5NS1Kf/03P8gcMG0Qkqq83OaVU5G8OF0+vugXlsI6UbV3vJtgC7eT9KCoWu4HxnXGUrNROm+BhY7mRRc0kNM/4SCQh8Nm51P3d3oYBAGaSlhVYpnKo4mG1rbhDLk9MHVKJu2YDkj/dGQaVwUK9UrDh9bRV6Crxyrk3JqJsmy/Aq2EDj86rttI9ckZMUjuaShSDh3poClm5t8B31INoPNrpbXpYgqhyGhE88gLaQEZuSkugVFHjxKbRG6A7p6fXNjMEFeu4jdz/USOM0JBBoe/A+PR2ZlPlsLg+Ga1BrVpF64qZ5PZY14Rph+k9feM44zmlGnb/Mt1MpGwITuvxmfdRT14/SJGbUyeSb+vtPFeWb0j+CAFS5Zy+FdSogCbopGGQ3NBfIfsz3NW90nBBzvxdPuz/7MMGn7ndvNbx/sOiU9VEcym6qcT6pw+A5E="
  },
  "bernard": {
    "salt": "p5zCk4aGWqlAfQlhwFNjrQ==",
    "iv": "rSU9/9SAYXWCkTJ1",
    "data": "2rIJEQm69FQvQEK3aRz9LN0nb2RoHvajexZ+78bGwE1JvRLvMHMN7UPScH2LNdyEbc98cT0R83BMZHu+Dr6AH5BLWXAcGeQmBh9RIXAV+Si6it0OYSyva3NER3y8Ds4E9I0Ihil6TKJXTgefTEVniitcOG776bmyH6kEE7+gFIpBEkxVtMMSXaWW79gsoDcMt+U0N7NwkKHco1T7F30ANzdvu978pCVFgNsB4wTvMQBnqMihmCoG4bZJa4v/icui8F+fHXRs2TZxi/7LNeVisWuGeVRJzDHoDCXogwBpD4S4nrczA6mdVKCsHudNXTJXBn8cWSzPrQeHgKp/t9ZPSTK1mAcE+ddKSlEPcd34OAryHfFJW0apR9qlND1mOLwBWQzfKwFCRcFLuLRBLwAYQ3Py36ZWn2eQVViek2a4VP0KUAkBYd7tJGfDQPuAn7DO8cIipBtXVHtWTL494KP3kDXvlRiKE7JOxnQHeiF5SwC8w6C/jpMUokZTdXGEt7Yz2MrqFo5Cxenk9xwTPp76EpYdU9QL5Xenx79sAAy8E1RoJkupFpoYgzLuU8lSvM+qCSw9CmU1N5KlaFjt/mV0MAGOjWkd4HqM6Nigx2FBFXGPgdbUzOAFchw7U2suqoFbVAC5Z+IMU3GSdP+F2qNA018b3+/6F8SsyBTDsXQcs5ItIJIVrHLtuxHWUnzJvzcTkG7wL323fS+FGVDJifPww77cITngdzOPoM7PD8GnPfFvNlUd3SX4drblPgMIJ4ETk7WTo0ppX+0e/UnHjOMb8oOicREDhOnRpi4+stOCQmyQsmR83NFfEqZUhSOceH5mTfrONhNXUIZ2JBovUymXLz2mdW0CnTG1e+PhECFV+VKwYeSa3Ncq32im/3B0J3H2pkS4dzjD0snOgHqYCMf65ib2KKE1qnLcLdOgyyRak621YLQrPlwOFxJ5Aq5BcWa+gpogZ/xWYr4/SjtXu9Xoq8NiayRbHzR1PDbiYaGz+guDypqT91au0CiSjmoepmtqdp1y6bj4JYkPC+e42pKA40vlFLJIXbGH87zjKrlwRFlZ3wJXusCfAsC+gJqK5fo2NTz6F7lacKeNPaC2WbnM4KPA14mI88YOkvhILrKRxqM+rbrDGtumUtoTPB7v7l+N6bOGme18qEgi5OEAYpaY/BKWnEsGA+kUn8nx+GSc4bsFwe6RiC4LuW7NZGuxdT2pB+4PcBGUgxMwCBBd2+ZG08ceGgbvUuQHcZWtEpIbA4cN8msGh5Q4b3eXxpVPo38Wozhydn+eMaPLzw=="
  },
  "lefevre": {
    "salt": "lBboopGG30lBUGpWNgR6UQ==",
    "iv": "M5EHmOrPq7MV5Wnz",
    "data": "dzj1WsgEPkaw1+ePTK02/tTQv04BU2r5bQfySAcQSqFyou2HWmv4RiGOrWa1P06Fb4NNGJK+f8Ub+9GSZw+CO4+y1ijWC50/s74gnNrBgKlbf/PFL9g6uStMxgy2Smaf0l5lPQAVZBCqCf9bVqWcJ5TjK/4MkU0dbIrKfT15GWahLKwVpGjQ0d2zhS6GIUelTQFYiafzBl5KBE1j8uQUB+FoX6v+/x2imbEsUCtQUlkJCCjbhkqYkasOHsHNFjc9iOuOCDEIAvzXe5w49d6Qc7UHnz+US/vI+AUE14oQgiC81anPqZqKARDFpd1/tj4M+lKT1zJnsFfu9wUdPEZqGh0qUT5Cf9uw65deUlT0uDchsSNSDAzCjKEFFoxcyF8OoL6NC02VQicrmqm0HOV0RxUa8ZTLmvY6vS4s9p1pA22Q8PXnHcOz0udU0w/vMaHioH7VMPkFLeOcO9ADUTVGJtuuP3WZetURenAxpx+in2kJhRvo8LsSTh/kNykqFUsPor1vxpr3tlkCICgXnvA8prjE4/1oignUlrfvWcyhuwkEE8b2g/yiDK4ikMFPPqy//fbRqkvOn8qDPpHc1d/WLUgL5lTdw6ae733QmK3ncjpirsCh56IvFNpTy4Gmbz8Vwcgs32MpURIHdCEKb4CoRxPdrpfWgH1PE1XInXXfSvi7bKHYPirM5WIWlT2Rdx5mdulhG2WdZCzOLBwSLkPGU2trLxSVtmNAsxYjZHdP04j8jsf/iQsSxNu1wIEv9SoEiz02nZxo7lmy6k7VCzMKYF7foyKQt4NCQH3jPnDmi4ypOcECdAY4kdW5nkM6AgwrmeaUf0ne3PtwacjJ+UcH+7X2WnQR0Nxjd5dn1fJgBNxTqh0TOoYASljV45PcD/ESptHvFJ7xcgJY1O13r3B6x33XTZb39Hj9/1FddBWqJxUNS9RLGQN0y+JgxHTYqmO7+f3nbHZYGi/pENwCNPIY0pOJs3Vx9Aa4fe7fMIhISzSIRZZFX0rvUAL81t3Om7FYiF5ZdDL5/v0KXO/snofxzQb6mBoVAMYniewphXZoFLJs2g+3mDO620h0C82RepOUQtDTIOa1h+6HcZvGMzySMhcvhikV6Q4HCPPW+xiTMv2phst3YqZUaoNF51XUb7f1eNktYHpecSQQeEVMRhzN+aAWFvu4v8+LSRC0G3EL7U6XpcuZrHxqO++MWuZA211d3l0z8b+9ng=="
  },
  "garnier": {
    "salt": "IKMMeGxCYbMeVqtVqbGt1w==",
    "iv": "IVqU04F1WrekS7pi",
    "data": "AIQ2L1gBB+jdPW2xkD8kr9FAclApUtHCMvw1KpTsB/wo8vCOSUj0FbfFXfatqPxVVZSjirBFCWmzMUsLECqO4Dv/7GMr0LNFV0bO+2xyAOJ//mgYVeLFnmQgrrCS2ZTfsKtQ0TPTor+NFBoc0PNKuu5eDxX6wrO8BXt7FgTv+10GSvukTV2rqUng68BVmyAcP/aaOiLZDpxxjr4rWmMU1u4J2vq6ejeuc9xfb8krHxyPs3PtR7r45oyc3fUU3eGYnFHCzFKCd6yIo+vL2ZhNzJ5oYqsy9rbwvkoyv7UxeUS+wNNamAtEMYES24dbGc/rwdAzreNrYQVCHOiEIKfHFwh5SvVXTfjdJgHWNjo7TsPj8PtYcXZGsiy+oxvYA/3mb+T4ozYRGssvZNTq7UCbbfA3Lv6KzWSEDct/t+aud6HJn6xSo6jyHDl4yyzC/hsut2az/JxXQP+eYrgkoZ1bDh0usORhpWu2WqDDPQDIWwlBGZCky7yqn0KjrXZ1wMrr9lx1tIVUDfiMuttAj2V40x68IFJuYhI59oEojPYtj64SBAEEVVd3vo4gtBtEp/RYicmj1sd3+KZSo2dawA9p05Tur60idPvUpt5RMPEdfcPCYi0oYOGEHT06wgx40ll1yJwTqrhqC0p5oW8RxeafCMzL+4iHZNmPM/G7ApTyKjmTAR2S1IpX7RkCdESVroce56U7FuBqIrdxxa6s2pPfTR2/s3fMcC5Ep3s9IQ628U21givwKLf0SrYmI8JBmVViMH6TK91TUzY/vlFqYYH109btBaT/tdaxB9oFEBaIF/RVw4Br9dsFw6y6BVbpQwirJCwVuSZoPXG6zEvf/w+55DJRBz5EolyJyW6K+InRrIqy3LsAMu5d00WLQEIFvUL1E1bul65gYAHGeNx8pEdIAs+17KQtklzKkyM8JIlIpA/VuGIs0irAuqPEd/2DYroPNSPFrIVXTkEh6C3JNiZZGSAIMQF+kinQky6MscxArVH1AWlTeV4O1UkNIbgEIk5+ZdybB5o8gYzWCKGwVyUncDmbQ1sg/O/en8GEQIrm20CKNt2LUBjfqr7kiY6nfcyCNUynmm3P6T/+grbwvCicTBkLNTdLvjXuAczzcbE2HGpVGpybXCc1Yak/hqCcZ/Gyc0Owi+njJA6Q5SQjj7clRW+lVXCaq/eyl7R4TLCAcTf9zFO5ZYFUaWKnKp9F5a7FRoDf9cbdzz2WRc3GJO+2qrSvekCcXSINHUp1bZsrBv/5O7KzEOcNS9v2s/ZzpA=="
  }
};

const DP_SESSION_KEY = "dp_session_user";

// ============ Web Crypto helpers ============

function _b64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function _deriveKey(password, saltBytes) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltBytes, iterations: 200000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
}

async function _decryptRecord(rec, password) {
  const key = await _deriveKey(password, _b64ToBytes(rec.salt));
  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: _b64ToBytes(rec.iv) },
    key,
    _b64ToBytes(rec.data)
  );
  return JSON.parse(new TextDecoder().decode(plainBuf));
}

// ============ Public API ============

const DP = {
  /**
   * Connexion — tente de déchiffrer le profil avec le mot de passe.
   * Retourne Promise<{ok, user?, error?}>.
   */
  async login(login, password) {
    const key = (login || "").trim().toLowerCase();
    const rec = DP_USERS_ENC[key];
    if (!rec) {
      // Réponse volontairement identique (pas de timing-leak user vs password)
      return { ok: false, error: "Identifiant ou mot de passe incorrect." };
    }
    try {
      const user = await _decryptRecord(rec, password);
      const full = { ...user, login: key };
      sessionStorage.setItem(DP_SESSION_KEY, JSON.stringify(full));
      return { ok: true, user: full };
    } catch (e) {
      // Soit mot de passe incorrect → AES-GCM lève une erreur d'intégrité
      return { ok: false, error: "Identifiant ou mot de passe incorrect." };
    }
  },

  /**
   * Retourne l'utilisateur courant (déjà déchiffré en mémoire session).
   */
  current() {
    const raw = sessionStorage.getItem(DP_SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  },

  logout() { sessionStorage.removeItem(DP_SESSION_KEY); },

  requireAuth(redirect = "login.html") {
    const u = DP.current();
    if (!u) { window.location.href = redirect; return null; }
    return u;
  }
};

window.DP = DP;
