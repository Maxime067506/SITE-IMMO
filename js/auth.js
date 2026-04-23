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
    "salt": "7tES//PYzFrM88QUBVwlBA==",
    "iv": "1Umq9lki6lDBDwZv",
    "data": "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"
  },
  "nguyen": {
    "salt": "EQBYDgXYHQ6VfvFC7lMuWQ==",
    "iv": "VlltJqKJhhISWo6P",
    "data": "XRl4IqBIUAlV/zFkaYNSgAWtlRwhuBc0Pgcezb7Icd5hIP7woWZIfoxl8XvK/A6eHzT8By+wgx2VVTwWwIvXZ7z2+86qA4kmKMt7XyM1lPda6xThtfdD7g1Jea5oxyPreduAZtBRPXPu4VoB44wdMBQ+w42AE+Kw2pQ3h3tD1Rf6dm53/Ez3g0oC76AQ97mT2JiyyYPUIWYUofjgEIUGQL+BZgA5/byFuWfIB18QAsO6Gjf/qKrHDIPy2J04o/DU4REti9ye5z4RNpXL1TW3y0g5336jA4rUAt+Aqu8vvxHF8bKWRmL9wb8vV8+Fb2f0VH9ukIjNRbBhqO1CmCg/ZDxqAgbdOZHcNDNwiO6dKLSiOC1G94GTea0dG0EetAGl0rDWEj3rEcUOrEHJhpVAx1ne3x+VnQdwB2y5ULU1ajHz/Aghgc4Tsx66buoqt8c/l08SoTWy8sBXBuKFGnS9EslOy2Z7a2bOgQveWQv2cPrs1y7AHc6tL7QeNo20ZBLv9JIdZkpHifiDFIlI7eTDxB5WDTNolnHC5kovsfnEFOZOYwGYTF6Z969XAycGA8OyM+ZJnxOzv23xcbUV56S99Ya1Plh84QQnoqyw/zPFHv2n3MkoxG4w/PQXpsucDV5+wB11z3BeJVYaZXfncqzY81U3M5sD0hg8nshnFFlLbq/SOkP0nD92ObSPVSCX2BZ7HAFqF9ibnQSg003g0PHCF+D6+bSggkvTT5bO5i9umlTIZ+uJiYuBc2nkxeHwtYu5lrnupQkcjeyu815HZWJEuidcEo/lYL4LjjA5OTxdiHIIEHqjXYajUN6fRr2yAQ3IVIIain4gW6cWBaA5gyC6Ssa6GxBBrFoe8yOduAw5n3OOXZWUOpTneHYGpsUEfM8ct1hBq5f0ny+7TaxuJtbfHy2EIEhwszUa33ZFKdrkMgC4uqvg3135dgODxZ4Itk6OXa/+RKL7s3EzsJwIqngA+tgN4/XaGg+qJhTsXLSPXFo8g9MKj8il46bBJ9Jx4YLea5/bOvhnaVlNj3bd8wg80ji8rytzSS929u8s5E/tUGmtHhEZiaArlaNyBp8ESOPsm+vB/Y6Uurgo+banFbCdqJtXZYfOMnu+M4tAflTFStuvbfJ1UpkSxamsXJGNHDJYVUEouz3gLYApf6+ZFhRX5mNAWUpqm/6VtNBAVAoOuRqDGZyA3ONg7SjA8tBFYHM5dvNwypttTdahmjArwtidgbIPhlST1twhJKjAyuuLLn6UXAbIq00mLirBzPDTx1Ca/uarnRKYZfiON8PpD5/t3F4w1CMhrIdWSUUfN5HueamydGo7rnOicCxp2Z7gN+mwG8BtBF/eNsMz2njIiy+EdA/9GnqQ0e2h+byAqH7SK534uVL7AuFcPoatuxiEkOoTlDcai2ng2LOQHpbWNwFVo6k53gPIlrouFzf3MNnIMsoYd5qhX3zVHPbF7fVTy4wDRiqcPWkCLYdE2DBQ3RnzCQu/ussqpoG06y/0IZXvplJvU/k5f/al5bPVPQj5nrMJB0dZi8fme8RwU1adg1J1soKNbqY0o2n0yDEQqi0y9MV2bzHAZnigmuFitGkRBRebhCtzarxGsQFqdno="
  },
  "dupont": {
    "salt": "WsWxT7QjbGxhG0Np9q/pZw==",
    "iv": "Q+VAQnG36mYWdlHQ",
    "data": "5KRHe9B9umtXe1CF7bOKGstkQnkmpBIIec8MHjQKXyh1mhyCMZuVba1E8V8qzqmOg2ILyZ4HXt1atm+xQ6tyzPm+zntbdVqorZkvt6DVYqBJ28Rp6iI23uAXjum1+sU7NOSE/nHxJBBvx6Ae3jefRf7r2pbzE+tkYmA9TJ2xpny6WfWacJfiAGGvyGqZ17cidNzBQCfxrAFgyo8zw5o9BpGVnePMlGLKhEecKr5j96ZKo5O7Vgg3krA6ldbIik5+MMxh5HgJjswLZ921mBboFkvE9sDKYvbIQ4yweB87MJl8zh1MwBzK3eTmoZvEsxlS+mSZgW5oS3MJVKOUFJ+AczApWRlLWdz24fl6JsA2S3M4FRxDHUQNd+y837p5hyaDJtHb6jxi6+ODyoSkYbvs/bILGVEpAt7vxo98mX4NIZm2BqUi2KvwE7KOZOFSTYe6Mun8xmy04Q9iIab69DpEIw4r0UFBwVn23zr+pfocUXi4gd7uDPHHI+T5397hxXU2y5MCvsxDyNJZwFZfoTJmERKUrpQeZ3dC6huqkS3Zp4mnMW24oqF3xnYCFBZqdcKgXhTV5F2oFuOuSa/lpK7pwc6XRbvBjK6JIqTKQgSgNEZpS6PwFqeM33LndLswrndzmat5UNJ2wOw81hyhNofuV3k8DG3uEjbu9P+rXsZ6B3kaagxX+DJuFrpAmV7Jb/v2dQ9eznfU9xbFFln/+OMfSEeu3XWTMDeTNauR32H9Dzp7h9jlvLLPR2tgaFATxOwL+24h80gI54sG4IpHcvatJKX7eUL0Q6LmMwTHWc+IroBYvEjD9ledBLDxzgOep+tnqddHJBalzbg9zPq6nY5jXJDS/3RsfvnE8p+bhGxC9D0ubmtAdpd7vwx+6b4xWM+p4gKfQFpE1j5lV+fHw9HSjsS6pl9g70dy8vZ4+gif6lZXx3JOoYHoC9M9Rld2IlBIuDbY4wNnl9c6Car1WthxEOUrU8CoSkYl/dwQ46zRezONgYENxrXZE9trLpskfUuEI6n4D5doUxNrZIGtrHF5CtTEqrHVGG033o9jvg4aIWDO+LgxJYiBb/3iDzjv05OJxkBUM1T6SjRlIYBlDnDhpcYSm3e2e6+ExkJ0iwykCiJ6d2rIFsHBud7bA4iI57IKR3OgBvYsTFntwee1BJvm6wKK9jFdveMDJGwhMkNGu9/8xgqIRpa7i9iWPFDCYvzXffoq1jLrFSx0TceiId8WUKs35Y9ikdudH2bpGr8sN9uTEN7jaZUMy6GO7jyqr3R5mmghJTHtZObEMvhVHM/sj2d+FFeP64pZjVbOZgI601N7HDcy/dMEkpoALRFXl3uN1UIfNa233tjNYF114A3/Qm5L0nhhKK5YO5sO0TbiPyey9lsk9aqkPdkvZn8kGczVGQVVe160EzZb0tRVfd9Zif2it5qSKXujJkJwebUiXekJZ3wcKM9C++dXaxNZNLe2UagPQbFXSSxUE5K5x21aIl9DjSd8fyS5BIqwhyX5Il0205kC5ewqpSwGCA=="
  },
  "rousseau": {
    "salt": "7g1l6hUDNk9JvBrXAApdMw==",
    "iv": "8Q3F3EArp9cFw5FV",
    "data": "V2wffIRCgE3ph2InDVDKbXGKoNYo+WnC6RsAsrGOsTkEWcp6XJUXgNBIFHxCkzKMJh34uBu0zwHNWeXdxj2e7WV1bd0vgnjdWT+Cz+7BFJ0Eh2LovVXUm7bMcbYfi65aeQuDUd/7/WHK0XJtnpOGWlzPWrfMd2bR7pudaIddpqsOFrI/3U+R9Mw24j8q1jG8BiRswVsSIoPvkZRDYxSgCKrtsamWN2Q/08remkKdiOmJX34/yP0hmL+ERTJPNYgmnG6c9uHeqtVt2FAV7qD6jpzo/wrkoJM/BOB+8tVZwFYgi95rXYOkA0415daDspsOAruMJP03nTC4pQqE7T8Ena7mm9/iKts0aUXfuemyeoWvQHqjKHzizlImfdPA3HuM+tMK21TcAA657p74sZxaLCp4ouU9ZwAq98Gnea0uuDLnZ8vKm97VxAzZbrMOnfCXr+biwJgxL2gMzlAEbhwt6bW12ZXFt1AQFxHM+qIkhKGiiEiHh4bvMdKAci5EYRHIv2KDubM9e3okNfvl4GbbMe+uuL4QxcWnX3qUJlBNUZmIH+8znlkTDFEHjDj2RxEE9erPtQRLJhez21qZMWXn3iw0tPMtN6gAfrjzMvUA9ZCK4aPzNzs7j624OsZfOyf6UCC6C90qpm1sySHlp0NS+VfjxHWBNlTnkrTF98J/pX03Ma9/Wxezyl2X0I1GTNenoAhoJgGemIHDtvV5ChzSu+MQ7bbuk4oAtQHfZBA8y4Qyo9UpfF8mF2L4DragGtkpACg6KV/tqCCKRvqibXVyHmaLIR2pTrnvnvZtBcVJqWhFua3/gA9BvN5W90Phc8BoAK7CALMk/uPS+wyKdVJy6tYDYakNuGO8WJl2+Vl4fGEOWlN3DZ+ME893lWJLiZuITEZXS+c9F/Ymu/GKvcd7JO7PLegLFea/Zz7oz7kSLrlqwtFkygYKdJCrCtMMaOEYUrGaj8PyXLI5UFsEZJm3A+9vKYnEGvrFxEQoo9wWLl8m04ROQPJUu6i/grng5jk6L5RrqZNFVD7iBeC0rpX6pxSc47YwCYU/NakY1RIqWf5U4WkY4lW7Jwzekrr7Yfo5uzgcndxhHmLxMcY85reHudxNEcpD1q3LilXaranzwK9wxnQIZDCxhdIKa9tVEyafnepa8h4CLE4QAbDsMWBIQtJNy9jo6sEsJZ8lCZssVb7/oB4mn9jJ9DVEq4Yo3sXN+mPwDf5LjALsuM3pC5JUqSxIV63ouHcDg18j5Fg0npSBbBYWsHNV7KYr2hqvLh2tmw6rEgfg1Zjm/dZP8mhEC3izgFP5wzkBtmBmHR1wv+RH2OcDUzYzzx0YU7hA6wdWSA0eoow3S/nh/5ZbztfUdFWM6cUTnpKfhVsSGdpTgZ2aE51rpLNO0C9/KiArM8HkRPQAovu94JnLokuwb51MCv1sSRGqvhrqjXSAqxeFQuinaLr9xxo/FyO8sllRVqGEu3SzPop7A+POwk80v1Nq+V4qCYJkB8J2NTAY8bw3LgiGA7jjulRxjKrbaVTJJbYnScDfB8h6N9WxQTXa7fm5Q64CmGLsXMYJBFCvyJrpzgTBUWCyNENYSKSwjLD1E5iQ1XGgpEOKfBLMMI0I"
  },
  "bernard": {
    "salt": "v+kgj06fRB9bLcIOG4857A==",
    "iv": "BD35i7L1hnCjvov6",
    "data": "qSXyr93rh4F1UnmQ60xBwai4n5FjvRrmM6DgVJqyfIIHshakLKPBIOAY4c2vgCe6n4EEdMouYIwbRJpHLqALoHZRBq19ZoV+k9/2LNU2qsh7PAFVujeOD+CR5w1AYgyoszt3ZxGFdkWcJZZmGUdKT0bZKN+gGDhbasHfKF17KFsM7XQIaMDZ5GaarrehooEAPfW5Go0sMvNDxj+rkAbmwtJ0AljzehMJ/AL2gpyM314qX0qYP7tuuWgZnfWwU4FusFdV1LCAT5T1JV/yeUrENaTJsjiGsbMbskW6Fu1fET++xazqN66bskzMzYWJPJ0rg/8wDYCDmd8vMOgbps1+35j8KP6sgtVBfmefzPYOoWbZcnRjiJyOj7QjVRpu1uChECekYI/cd/OOBeHT8zCEG9A/Uu/G/saCTrhV3QhMo5mZT5StLv+5J2TqDLs741cBRCl7MnDZb45wkYg9bIIOPLueIXHTS5mwFKSza3EBEnrd+D1i7lj6sSigGATAwrXNx4UB82PHOxE/DKIt89zwYYDcKy+u1BLVGd/PnDBt8fVC29E0d/bkK4vK+fPh0INeuQ0kS1AC9Yt15OMkxdy7WWZgST8cPahbzNucQDHK0zDkiF9Ipw5V5BmmDsoII+SiVA5aGulFYwD1nOtEEq4eL7mswTLLrU0gWYUgygKLca+vJLi4eU6rkLY1B2YcLnYBFGdOW4FI3of+m6aJpaHNehdlOvPVCJo5utwQ9BPh1pE9eHwXtRP5tfe1t/t2xdE/fHaWUL9+04CUpRAntLnOGP6BL0S1OEbS0LzvD2AJQwN1VVKiU8+F7TkK1pVtaxFrUzi6SFe1NXLQlZ5xhPqf8E9Wi22O3+sbtUgo0P7rM16HBK5WEfPQgjvLGFwug4H3Z2t3YX6jUw7pynoi99tzBDPdRmaGJdetyRYsjlvry7avP+2xz0G4c7QqjFPWighHU1fsW5EWXLG7XNgAAkOVe/SmwaNoxYdjINRN0lfaPYVtwcTP/pbae3o/Gdb4pz/G6PuLBGYKeJM7rET0lKnScm0HnEUKRK7LQeHN8W90kn4xAYqxkBczRXbndRRCCjvxhMqeLcs28Rk9E6OcvCoWGF/anwA9Llpqq73odrPx8QDJ6XhnsRtgUj+Sq6ziKGEzj9sdJl3lxaeFSP6rLTa3ezCdAuJwEh+on3hIyqx2vyYiYXyNnyeNzoHPHz3I7j68t0PLNeFx91Rew2Vm5miFj7/Y9SUF/tM7S29W1bVDd6JP7jOLUlD2r8B3hIrEwFr46zKqFSr4XEQsGpTEwefdeecGkKHYJrvBjTVzaMYSP58wM83T/NdRCWxDC/whSchYYBbPemIlPnEq7emVeQTGojovtb3bj6cgcXZK8SISEERzYU9Z7tPupGwtAkvAbNbSGNWBEd2n+LWrpG75Nplf1KRfxUXdyAtIqAqtScHeWG3vCY2SOixm67blYZ3M1xeh/nX8ex8Pu9EgCb1I6eMj2MtbT73K8CHtfsYqyBeHpoMb6ATx+s5oP9YeulDPEfzlOEcXP/diUF2I2M4+xZozQZXbdxT0gag98Ynw0sRSm/GBbM5tFu33r5NrDpifZmN29AtIEV0c/2+M1kxvFAQnXL8g8Y3Diw4fbxTrvmSuK0i/1+pz4J++dSjngFN3fbb3lWj5ae2iYSfvRr0h651LlRyrqEmD9HjBawLZStqSI5jKtNrEJIwLaFO3o2EjzKTA2GwM9fQU/qfJAwTR+xDjwigMZ+Pvm2j4UvEE3abhxaHtOVkBy1+tanXB"
  },
  "lefevre": {
    "salt": "gBy+i3f2AMB6b4YUXUzhSA==",
    "iv": "vUCKuStD9w2JROV1",
    "data": "+FHIDs4F8VMOXiDtovAGvU9VAlQTbYDuoRD0Y2VeMGQCCuC4BbOShlcLqhrUhZHPWmLTSL/vtI+RSVim93q55/G98mQ7hogJIoyYCjIFUvVVVkK/8qoGbPGNF83ZNJj8Mbnq7C2wNz1Ushc8Duwlnle6+r0ZDcLoTRB3/U9JPnMmXeYYP7qAbDxMsjvj0l0WPf14IhqX6JB8+fLgPRQ1h8YFjQsti+cNlzgOEjtkfvu3JRbVK/zY1/xEu5AG56bueodOVdmae1RyNtNx42fW5kUoF0TEwU2ah80BMIj0dxXjLKCc3A4WIDgACixgqyzkkJtpkWV9ABL9mVXRLLbDynmiRm2+npVWrBvat4exRfQohRqZaSO62kEDU9Eqe9yht3fAZYUYZ2yaLC4z05fbIgQoKHtyLsDwDuCdlQQ/VCCmzsWt5LpQ3SftNghfpj3Opr9+5hgi/AIS+dnDqnA2SugUB4BnUDfVGu1mL+gZjcfEw14h/lGMcZe6Hxcq/FoEGNke1k9ZkQLonu2JWRMAX4gCs65ByxNsfhgcgqZRQOelw1nov4r2arLDFpfLrZvFcRbsGqjLS/YSSo3oZRWk+rB+lHdAExfS0N6ewAt/0nEcB8CelwcgFQXYMnT45v3zWLXuwtEaHcTif15sBy7lPn+JS7BK1XlJRhaEBxuEA/mHg5w0z/V6nssVZ6mtgEZzR/QeQf5tgg6jcENzIHWFDqRM2QS900WsWTOpAYEYjC1ek+iy8Tw0mxMygyTjHoFzjAapOGgU25UCK/Misge1AbGHcUTlCQ0gSXXTYe/PUSUBbywx5+g1Nyb35IPESYSvfaJsGJdcAJu7LrpeEFSpSA+wO+Wy7Eh/TzDFZCpKcH2k1uBcOEzmbfACMEPPLeROSq/4eeg5UGKCkIexd/3gxWCewWPLMaEIRPNpsfiq14HKLBXQgyLFMyTk9CZIdLRuYqwrHS7ipmAfHhfHrM1rQOo9xUskoZQHPgCxs1dDU4BVcmbHNkT3Pm92ssW2X4rcfuuPAQzUjranQ/A7SYRA/ndCZoMp1HFWqaP4kT4Z/4jtRU12BKASMoCrbpYim9qM2AWpbytkKX3QH5CqEKRr0SQiTw4D/YEGj9FKnKqBg40+R/gF8BkoJ+GYXwskRA2S1PyWR+FOE/oxagNycbNpDqnO9nNFjkprOA3Q1U9g3NABcLi3TF88CDKiptPCnPCgHrbHYj61LQ=="
  },
  "garnier": {
    "salt": "34ojTbZGE9g7ItEejwy0xQ==",
    "iv": "fFr9i5ycxZn+3kpi",
    "data": "pF516KruQZnDC5ILLiEVtx3ApGlPe/8s1PQosAs6LNoALPztn4B7CtMny9h3b9v0umS5Dwm6socp6GZ2O37jBXO5fTzcn6gRls1HMrrpQnxBRFsjd3n6JsGVVtaYineGeekXWKtM+7fDNK2ZPREByKSnxhmqFSdGg9DKTaYxRd1/AC/aweDa8RyROTUgGvq5rhkWN18G1zFNtNd1oU3MsszgxFB76a0+1mEla04xu9lRKybRPD6pcZN6v46chWdOylZHHIe0a3o8csHfIHKXdScXe000xrVvHMYPlViU6Oi5byabXnSCfeWPtPBYCYS6HqGN7b6y+F+NUUrwmXvTvJi8QN/+4UyypeO51vEE9Y2OsCavzHC4pswCwV2gZ16byIAA4WTUVjiuQ0sexRa3cQ60CxaUDpzLE7QqJKyoAmakyChfL2+Ksk81mGzWBwgW2W0GXyDx4NycV588o54lfl/yFJUMc4HqLgN03B+Xrm6/6shUUUmg4rvCNABiaaNrqL9yKa96PRhUn+YdOxrjZQEzSduLE+kY5MkkzDVSMt96jtG/1bP1kfsezA6dfcHSG+tXeoVAa7U4PHOyI8JgijQQ5y0wcFKiCxKdwARIKIIKdvyBweP7f6R2USIYwe5p0ZfkTU9xgXqDkaNCqJtliwhSBfBKZrtEJ/N9gw5Swk1pyY1Baxksi0xIr6V6s2xLWLpff0AUirXOIBwNu9K4Hq+ag/GmR8ji6+1ssqOGUcMn7U+k41ze/5APSFxSfhw8Espd2RRBCUzQzAq5NXLyPj1Ins0HkplQYMFR+Ar8z3YAw3lDZt+QR+g/oWMp/XUWL6zmdXtPGTHqttLbYs5yRZVtHxvmMS+UxOeGLMveJ0YeOs3Dsa2JlHfY1NnaK/43yqfgyMYgFAsdhwYecXBCbZIedwYgr93BmoNzYct6FsZCXiY3FXApHnGYw/4pYWTdVKVjlvIWF4sp4X2Ta2dUH+gi0hSKYTdeNy17t22CMnyKwRtv/V7AL1O80fisijtlPFQRvGfim0znOTRmOiwZq4mfUHosNkrV74q8pmqdxUuCPMs0I0D7fDzz5pNvNp0QydP/Nn+VKJKig4Nx3PMQI+ThrRK8I7QqykJaNZVbDHNjThstt9Wi8k9w8XZT3LdInZCzqWazihVmr/wqsco1fP2d97KJfGFtYH7WBmpBoct0du17frgHnp6NG87JjjDkHX7QqE7r0v5LqBU69E/xr1TsuGt54yVXgYYoj5AI9OmH4De6Js7kOPAUiElyjw=="
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
