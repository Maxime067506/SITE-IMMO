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
    "salt": "stpfumK+3wH5ovWEJZBVEg==",
    "iv": "pytHYJTQ7OF+WOrk",
    "data": "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"
  },
  "nguyen": {
    "salt": "18DLfMN/Y9WH3k3zgpLjyQ==",
    "iv": "eBI3IpeSTtFtA/5Y",
    "data": "ujV0UUfweCK41rdXz/WOn3zfnXA8EAlNe7F1nYZWocFNKijRGGoaM/OKliRULPrUByttwsQ2lcPNeq/xRslKTw7uOsnoDkvAiHQ9S5Ek11AMIu0FrOGlv+kMtTeRXYQ8283TMfp8FfEyB3ZJUiQp1WGhI0lHFOMNSMzczbAWyKdeW1OEFchgpFjes35oy7k6gjOdvVeCpnRBd1EZncnSTG1OgIZAxX2sRHg0VOJ1xlYRE9yo6GMnQEUI8y28FGfeaM2ioYKVSa6Q1TbthiSEau0iRqvW6gFaDhiVPvz/8FFXMzUXhCafUlAv8ZIULkETUQ/A6rBNsyBWjXMiZb2kokAxXKgXsPltt6VfnEOG+xR0VxWDISP4inEpcFCjxZ/PwrlPmBqflSa5Cevtcvsyp1hVY2lR42PgetAqlQDLCq+SXCmDnKNej9fZVkHPP0UTTaHZ7qyveEx72dPb9heubsWPCo44IVjZyQOVTTdC+ojK3eRt5KNo0UPUdOJQhT8OxmW/67tK4O/eH1XXeAaHPKKPn5+dsSQ+yj3ompLTrb2nbS81artpo0eok38VIsbG3N+6QotJvviztkjTUGJYghkoy6X/z1Lw0nr+hsz0Ho24UnfAfzi11UfGMzIQYbiczFWU6PX1m2ZMDeEQGeFnTxKyDzCY3e4HZJ41eG7yEcaLfKKRwIpftS+B67LQH57/pbiF8Q+3tdQJUlaHwUZTKEzR7B8FZ5gvQHLgEUKbA2//eDpIKdHitBLaUYbxfr8cytR/R9zeghjQAaJ63hKUUHMbZ8+zphYXhv0ibbJP8TmroHwK15TK84bTisCxG5H0H6jOdsDU9PMBkTNpuDmtEoYuBfZdoMkVPn5MGo4t85SVP9v6IZ2iqqnMkW5VXhNfTK6mXppquZUcLluKD716vzrmPhPymoGzsVPSycAbRjRQqHMs1sIwhmVJjz37oeLy1HeGlOoZHfc2sRwOK029DL+FErKbCMqv+kCzXIMhtiSsiS2PtmQvVVhxZgptTcna/htNa3h9IykeNNbTXGXO9LipKF8CASy9CfXHbE086u4qjTBTJstFXhwGo1zU6mgp6K2/QmWEljBVA3McYQzXFUAPg3fHcA7apNDFJzpIGr3S47WWoOD6dwfvVOK11mjEaSScCf/EbYOwit2xVUVv2djjbJaPSsMxNXMbDGhmeqwRu1Z45GjnCiJH8sxZoYGMrKGOmp5F+NbuoknkQZSzjWO7NCH9nWRSrH3Zh5jsbsbyORLchMZ1LnH9IMmCENGZoEbpWPODXEWtXJ+lnAsyXEaC0DoPo7GT1ZSEIhC6yAy7JsAkdSrilzr8hZlZ34UHFxSWxYSLvczwhEOFpeUvnaN4AR4BCzVnnniZt5+5T77apOIFpxtoderudBV3Qp4VFYrBoUyfVwX2d7AYkv7hyJbH7EJ41/Us8guN5lRlgt3yB1m1ZWgchSFo0BO21CvyIbintPtLMOZXyRRiQaLPKW2g8dpAAWSOH811oOH/0Ypr/jc6Klqafcy7imKH07CRRMP0RNY3ci5rjESwUvwCGS79pp4gQVp9dW9IFSJ+4HJRDwBv6xyaKV8vDIKJ0MqsTJhQH5o5ubc/Pus="
  },
  "dupont": {
    "salt": "OCzsoMf/bOkZN4nBrn0X1Q==",
    "iv": "rY/dIW9lRHFcnYlz",
    "data": "+X3yNV5z5o25gpu+xwxBrbhzusASEh6+DlbXeexpgMbLRSJpB9jF4RgU5ehlF6WPJRgyt98Oegc8xMDKfDDf/lE9BDFZhEUGsUNVfU8CY+OTZAMtqRYt4SILSaw8oyYAnJG+rqyO09kuXhFWiIvd+a9DvEaIDC7ym/85lGYiOb54NEBSH6urCFdG5DzqMKdpUoua1NFqv09QN4mDelWzYO7cixW6Wwp+lm6QNu/7eBfNTV3MYGbvWc0Hx18zpGMV+/6Y5jFK8CYI5EsAfcAOlGWfjBv5Y0iDtu0sCQBtz/S84HpWxixFmTU/WHzRHm7xnIlVbeMajtjH9vmZaXX+k4qgtJKLBviaZ7bPMzsM8acrgNMOqRXnY+eRvoZKIQ2PplUKMc/82f3EH8QsPDlN5tnMnQIG2fVZYyaWRFvoNULEs9g+Bwoc5LTS7OVTnUrJeWShVQnZY/UHKksIO8XlQcct3zE3CfT2nZpijmv9dZFERLWGvjFCpXv5yIm3kkY7WpZSsTdlUyAI17EDUj0py2sf1nyaXgIxETtGCFjQd7o0fVO54kYDpOw/hU62BEp8pL9OL7S8UCOGWz+VarZbmXIHIZkG5MhB92Vlv+3uDm/7KCKW34YnYYrC1/HZNpa4JlYecduN8jzJJtnG4TtSpbjQGz4a+dWq1jiFPT/OtYVsS8R7on3rltmbqvtjdZr/0kWp0/7PNwxieWv9MroNLxEnZIbqpxq4AnDG5cpHBuqjWR/XnH3bf1EJrTVru/juM69B2HVqb/aeUOpkl7K/UNQZeF556a5ygLH/ICBGu2PRAufjdCexdMLUVi2hdUnX8U2qL8/hdE/CGGt9hI5w06fEzXVfi/tgNfZTMqWsCUbaOCiAA13jcHBySSCaaovjxtfn8RrxxlC9R0KY1d5KARvkki+r7ZkdIPkSu0EGzC1oW2IXqxcv/kDEIreeoY1CmA5SJNuB6QnO+8ZpnxRTfAJ5YQQmAoQK/05tVbnzYp9z6k8ZQvkhwY4qvNvKmY43bD0DVwfD0GPbTB5EPKXQ8cUgU1J286bRymIXbfMw+heqebscIlMmmDOViDKDBPQkrNeI6hT7qPNifkrkMxd4CgZ13G76JDYtEJxTD8BwTAMdw8ZqydR0ssTtujK3SNUXdQAlD9AyBbxNgYQe+rfdGno3fO9eDWzfyjKTZOmiDX5/VLnu5L405wkUVmc="
  },
  "rousseau": {
    "salt": "q2O0FS2C7IfPcrF+2Z9zTw==",
    "iv": "kLgtTy9Hzzz4fzdz",
    "data": "A2eMemig9FL1JElorbY30y7EZfZEZk1h3Yq9oA3exHSDf+bWy/dlztxPLmznKI6yr/9aJRabz/AVIXLX80VpG0H2O8vLxqiwm9ZR7tMtmN0UZu0wPJZz7Z4we4m/k2f+ZGVrgSdWLzFIgq8sX8dWb2J0WZkrbsLczKEusQHn8Z3xzzuxBdBNKjYZLRv3YP2cXz33bSbcJZbZz/70bW4my3pavPugIzdI+uf91nE86+v1g33SnIvKxq9PxpbY0rDrREelpw2zR1/ptcNT8c8b3tKqdSnbuX+zfgBNLSv9onls4FDPn4azxqRj9SiFIHUha9WGOKe2tRjX2FHjDkbI1m2o2leLPY+7qpIRkw6mJeS8Blr8GF0zJ1PzbWycrzNjyyTsPLBLcHYYHH0hN6VWCWPk3lyViAw2JcIFBASLeANuuqouSNGpLatscTZa16WV+zQ9IuKkR3IdF/fzUlNjyHJJq1onHqkPaM5jjmRXkDEauEU1H98L/S5QYW4fNIM8sEuCXJUdcxM/ccDpdFHdGmEF9RpQodLS9sMk4duf51UfEJIV8KV7q/F4g7MITfeCnxTWVaK1h3qN+oCAllxH1CO0d2WaFU3sW+uNxztX0QBLQJoDO96HEUPk0bYEStR1emcjTvInhp/jlI+eJdrEpOJe7h4aDnIBkJXpzrDxIlZHEbrDfVD69F3f5bbddHVMnYYGEh4osCeLSvGHjVk/eaKDLi9+reDDvK92WEj+a4ba4Ok6N7Utk6iABaVjTiTM+HqHzidw80T0s/8MkL76DxBcjb6w+o/LgiG3C+eN2g/SXIoRWFfxsg+EUfO+LzC6UcFfmqYVl7fQeG3Rn/SRbGt8vgEIfoUbKPa5nqPE6YhGXUGqc8XB0O2rNOcoQZlH60bGlJp38xZ1eo+P/lqk2rzXdqVoeKALhQyosNpd/2HAd0st4eoNN4R4arLrUjZ+e+7vajnck20DwyXqHd7mpkLq0rx1q4CEM7m9ecXlQnuDovgskgIcntCqfrlxjO64i1TRzcf9/hjWwfCTLy01WJyPUvPuH7QdzmgQHxkhUVPmvQPn4zKouumyowMaQh7uccoNf92VtVNJKZrlXPruIJiH3x9PrGn/OgKI0KSGv62k0u0/cDymRsxkewE/PK4Dd6+pXB0SI/ktsZXg05DkegMrK4zMkkEFKiAFi0RBGkWMzIA="
  },
  "bernard": {
    "salt": "foFwNipmJfyXjXOvIzP8tg==",
    "iv": "C/PUzpZQtyXHSCLe",
    "data": "uiIC4RsbJYmnR9SuG3Qh8+JM/Q44A5ioepZ2/VRsvOiPLzyO/Ws3XjnyI+Xl64rfZO7UkBpRHXkZoP/w9mwK2asZ8wxkOBbWhhC+Ki1vHzvlAoEiNshqY0HRY2PRcpqbfXI957n347iqBmtG1HHUgA9am7N64hVP+kY2IE41jqUQIg9OuCHDrvsAuxG6IJ1hbzL6VZASivj7c9AeGn7U4rYKdQ7RvV38K4WJNf2dVmwhobqNWbSz5+tVXfMO2vEhe8YDPKq5ga2wmj23U+WorAF3v4z+eUTbe7BFs3pvd4s/CHrs8qq6y5eezk/m/VIQ+5tXZhq5dDp9zLt5Ts8B+scIC8GrLkKE3ymtwJYgCNKqUQsVJ3f2ZwIEaxVofsKID53P49SvLYYxf7tyxPnCv3dfCdUYjIZcaIyXCBO3x+RaZKQVYe9RazPEWPt44KMN/52IRBKJsJPHGFnS53+6IEHOdxkbZAykvRtYcH2B5TZrDyKnBvRe3xSR5ASLJRgRndIptOjJQJwSYpdOoji8gbt1t59PP2DKgQ+kVvXZjEmemQTM8B57A7wvSL8y0miL9fa2Pqnd/Yz1K5876WVjbaK7O2wsDIEaZgZF5wFZRqbebGs+jG8OdRxbI08UDrSY47XoFsWX1QSk/s+uSrsMbsWiSf3N0zcd6n4uVg7kEMLQBbwZ3CDQqrJN0s1SODVrsIxPdDzydDOzjRMY69wZMRkPLZzosDGVo2QdF+vDPQaqAgombunzDpiq8ZUsqYDymIlSUrs2oSoB+y5NZjSl1oNBn+yHd0R+0NPqFzcqq2r+xqGxEUiGXv+1N30eRF0NptImj1429JlPmCTVY28zD5TDydNY2wivFcIJZFrC8AfBiWapRJO4G94752Yolc7rkcL2Gy3YUc+lCPCEujZdA6UmdIPOOh4mcAeMAfEiIJoq0TT9AFXpItWm+52vc2wP9Y+huYaTnwwAArrl8u3+VCk1huZSgljULkOR4LNKQcp7W2gdm+3WxV+1uXFviSFr/R9yP6P5zFCfUqslODpyg3rdiZL0jj+NR7H63ve8dHu0VpYmEPvWVWL2/Pko3XN2kig6wHSWXo5NIyX4XdfP9nl06ake6Pm0tARPFwkmpojJm8t466JjPbcb6XGdplzSO23OkamD8VXlUY4Of++REgaGY182WcL6Vga6DcQ9GAl7Mo0AoaoJ0I3NaKNGx6TdVCb23NAI1Uii/oasp1GVWtCDxItsgMo9E0K/00BOC2HkF//+wic2hzgVZBNhESWa5qZNYB9qaXiDtg=="
  },
  "lefevre": {
    "salt": "q5JO/ycOy2tWhXLmN93yRQ==",
    "iv": "ofVY+sewsDB0kzaB",
    "data": "wZJwX1+0ICnTft2kU0ct11uhbkt9aryjyvtOA3jFsScXF9drJrC7euhb+YRKO1hBa3oxhyucZPbwSoKr29E1o4L9jizqeeaJlHjj/hmeiyxPh8bv0FQRz9Khb7qbmvyc33lv4xQJ33UY96xaT3qLGjIwisejew+9zGMuL/M5Aw28ZPe06WezHaUs3EzvwsKUPmUAcdHivXlhkipLRTYJSh9S1biiffL3AqDOyoDzax2ffEQ/ACxQUgAExCNEYTp9B/UvR/HEKhuMMwP9aEi4S8xjkbJeY4v2Q9uyd/1hs2ZRiz8uv1+vw/Q4rli7U1cRZB0+g9svGZBNMDc8AtrJGDX+IC+68CsEYyDT3Lf97JR7LSWwQ1O3orlMO6dXQNZzKKKqn2dRtjmmKgkbFItZIomHTWucnhZdtW+NvtmKXdpAsMa32eAhlPnR/EsP4jIcH415JC+HtxM8F9HCD7adtAy2DZiygSSBjy0nVewpV9uC1uWmbjeD0+3T7Dak7tV42d3U0EOy0mFmlE5dgIhyopYulf6bgyV2Ijev7eK8mr5QaLCXp6tYGZlfB5FVcriwRx+MCE7Q9Hqy8KHwwarj08vxEc3dUEPUM9wElOdyiaiumPez00ANih6u7v/lum/c0PgbfIaHtmW1eoCERBUp0Y14mCBOpJDmnFnJo8jlfRArCBjFl58VOjS/acEN1uXAPdwB7i8FGx5JWqUxVPZgljd3dsOi/vzEL4Z/gacd4nOOvGlUtORmdE4w9BAC+7Ymr7Fo2zPNtR2VAi7P9qg/3DhGj9tODLm1bwtj3Xwz7Vk/MLrID/p9M4ykN0x9avlvJIZ+ZvNf5GM2A5h0Im3x1FQXZdSFf1j+Q10oEhfNM8NRgAbN3lL5AySpQB5jhPqewsj91m33SRoSr6UC8OE4l5vW+lwGmLPTXulR6YfAWdsQanFNCapoZk9YYIVvZfNJYjC7Mjuv56boNV4jHRrMAdjODxb3xN3wqbFzkFb94pE2xkWj+R5PKVgcJvseRTLfD/4YGDyVBt4b/dFhZoBmwj8QemsZMILv42eR6/rB0Wo+/1W6HevWNZ+bHikLJ2uZSfLsTEcstACAMggAFBsL9KZTypNddNh1c/TD2FGQb6ApgQHqxmIzhVRUbXW0veWRUrs0+66lT0ACXJ6TbH44v0j6ZLx2YQXmwMRy031CAXN8adC+Lgen3v535YGGfdSRGvdqI9B1Ig=="
  },
  "garnier": {
    "salt": "O8zeS6G3G/Y/K7iTHiXidg==",
    "iv": "0WN9c7UFKeskVLNs",
    "data": "++Li5lROECpcv73+CDTDOoNF6zTOFGEDrIrZGVktyWp61CVcGuA26USezuJXwhGEOHvWZ2UXOuHSlOstlRVf/YzucYEI4QKO0r4/uYB1e0vu+MZ7CNeJu1LD++8LPYeZk3TFVYM/FBE84IFy8Y6PalyjaDbVDB8VKBI+03N/+8e6exrfvEhZQcckF6x0LL5edFPiA6wz72L+tTs7KX2rgX+znXp+dImphBr07I+mEEBTOqcjcAx6nRIsycB+bASqVq6MEy3a45f8TYRf9HZm7Z9/TiukxTz8nz7tvPhqvs/SgWSfSDiSLTduywSgkIz8CO7dhAwKrrrIz804rR5vodk3e8HnWfjbf2SA9OU4m+RTzPwt7L1D66zwX6f04eGg+MexQLEiKIAQi6ocnHNzqmy+Nq8XHh2X2uB4t2m6wOUvvlMB6O5YFxbtKu+/PJaIR+ZSfmaRigUMUKgub4PBxChQqaxwM0o3v+19iAiskTIx92oUSYmYA0HBE74X2FtVmfIMOaZ3gVjJPUHxs4JyYId/9z1hD9UoulqMZ2XsA9WP491J66jdNHszmybjQyzJP6zXlgv8AezZAfXHYXXkw/qcBuCOwN/E0t2ZUBqp4rXyZfwrgSD1jHc+Dz1r6PohF2x2nTuhFbhw0urS6a/J9Bxrarpx+bJebRgOrQX6GNDAZ/USvwz8O0sZDRz9TBdtW2S6csO+FZvVrjcks4/QEwKC7ZcgsEUEt7NaykQkoLCS8+13AfRlW7vIGJ3E+2vqLZ50zDcEqrzoSuvGKOzCiW9KBnbLRRgaOv/5SkSaK19Vdejt1KdC9Xu/IoF/fHsgF1W/MeOr10ZhqiK49X8MdqTYnvnkSAYJ3MZYWmmvVUHe4U6kKkjVMeLCLwVc2SaIQWIO8lAzVoQbeKwqks8nh31vBrgncb+C7QntSr2tHzk6guIbK6NqPqCJ+DnoewkpvQ1RUQ5hD7ZgZ1gdaVm9WAwX1nMCq2J/Ocbv5dwUy+Cz7HJNKK5NmjJ/6oPmtar0hOYBlwQJR32vyqUPD7F96RD4z4OiPTUbhps4Vb1Z9DtvW5LIr4cSXIBiThXkwMrCSHQQUwogV/Rg0TVeDD590z0jgYJOEH6QOnli8gYIDjyoLJgVkgakFpLx2Y7qlj7V4Y441fCXeAOenUPpICyciZ/M6JswLNDctaVfqOt1+tDPQnll8hTYFb2ztzJ/LCM1WMHtJ3NXrOnkGXSHrwII9ChAvO4jL2M6ShKIkhVyVx0r+Ut0+c0N3RyCmiVQdA=="
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
