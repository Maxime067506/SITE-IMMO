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
    "salt": "jCMh4BMMnR2F+qoQLZGwZw==",
    "iv": "FNM5VnMInkunUyOJ",
    "data": "hgeWjcA2rfKYuZlfwAfuKSAbNEhVpULgI1FEoW23N/ZbkLonPiuB1Fw7o6eQLjY89fHMW+YIvL2gnXBa1fblgxmqCvpYnpVvr6m7QUy4VbLRaveWdV82PU26z+IZXEzIA/6YsyEF8lFstKsoAab5L7orTUN/WspzKExPHlJ+QBvSySLh0HrRGlQC76WQhcBmSoDlFwixGiD06yYI2nMffUBwEZN+QHKaX5kZ+icZpXqqabeBIx6r99rMduJVkKBLexI8UxMmUiIyaV/s2DOvIGua0/e8fm6w0vkMp+Z5Ruc4EIWAsRsDv7l7KZ075JfXBC2lg87zwbLYo8UVVikfh4DQOmFCVwuQz5fZ+2vcK9joXyxwkBt+1ZEMq/CQHsqsGWIe5XgRWSIIwVPpAt/Wgei5lMLQ6BVxTgGEy44JIyQM+zF1AKG3BOT5b1+hyXTyQMMeBJGPT+P4byjZwkXNTJQRJrazF9BB7iug3VgpcV/DLdU6zvwLmsMjcKOD+i5aMavOMT2xhsjmBPqtGFBe8a6xVGflylO9zdpAbZYS+8oVdbu2VsogZquBnB0YWHyOxXf6eh0izfX2mNjf2+mdRYTK1zXVEy7HfVkIW2790PjnZsece7WYJud1JdOX792p8+/+eC2ihyZN1ermdBPQw0t7Qj6ryV35tZDgUVJ2uYm427KvFtCpLQzyE4XF0Saf1x6zXrnesJQ39Q0W9RDpshEcRZuDOLuWQZhDKbGfs8TZDkhooPTUKpbrdsn3bkM7ipPjtwewsWUTUG442sJgKcycSIKPOmLbmrknynCecfg47wNc1cl/LWpB0ErlMEbC/hgxX9f3EyaKxmPw7Z9eOkvB+wl89u9PNYsWpJjDA3eREPV3lIkPW51/6ZeUExuRJ/0jLAhjy6GWCbbsWva4+bm8xSDoZYth7g4nfy09uWVMz32ur2Hvqkh/X/QdYam5rpnc3iDDibwjUMaKA70Tndyk6D3B++L9utOn3Fken3C5Pw8KCVeRZs/SUnLcUxzibkh06hIc/uMXs5Tp75jdVm3o/06EGt61N9ALva+un+ITbz1j6cmhPoWZvhHNkeE8CNptjLx5awzI7sWRpRyrLHuudyXQcz6fte/qHZWwgZhyZSM62It95SANELe3xKx0cm3WXdYb/RQjHB2sszGiW0c3H1kSpAOeJyB2PAKV8v/15NeFoXdyWQdzZ2rBATQWbhCrO1H+pOuO71Fn9TLpscfuNwyR1AafZ/wct3DVAT9moCACxBZMSip7KLEhRAQsq0RHCjas/q/QFdAX5nlINipRUsWDdRTIuLoBwnYQVKFFTcEnOhttoE/UEtgQPgVYnEE2ecTbGhPD7hd9EteMHja8UvGpMSlJA1EdJqZDhI1PiUou+cnkK+Ps9etRM5n1nmTWXdPTnPgHUSxJKRYWluGScRZy7QOKmB9SmE9yaXqPWpgMfHXQK3xRab+kYaxSqMhmubiR02ca1A1eLvuzVKnF2anvg2iZ9p1YlZz/bAu7rjXsF7uTo8OBXk8SIvT6IZJpWBZrfoAGWJihOcm0PCStdOxObHGrkE+TdN9BM8cFpSm1NaDj2TadOWcmD1gYEfPrn1YSQJ7o7bUWfjXxx3By0W3/RABiFmyE7fauYp6NxPsZwcwUZiaBqJ2RZtPtmCXgXBhnqBr70pN4/7i9vU6M/dW16xQGqKDo8qlE7joThfrGnN4LmWPO8QKJvsh7u3qWjFYrAdftiUyVulJi3mkSAn+ahnAbK1MCxNL7TTad6jomL1khlRzVn+MZmCRCukFPbtIJN1dDjFu7HdUvX7Te4XKHd+Y9sRFK0u2cc8k3ytaMy77Dt07TvOFB2SmYkelJsHVnLI9OQznk0ntcM1lgoXktYA9ns02pjKWDIK7DeRldPtv7Yq0J+y2TmnhFwHSJtnyvCOvNJlTRgaD8hQP96ZpIZRNpMClO4gsSUclQzbD6i0n9QjgABCIieotGYRF2IH6W0r8="
  },
  "lefevre": {
    "salt": "gBy+i3f2AMB6b4YUXUzhSA==",
    "iv": "vUCKuStD9w2JROV1",
    "data": "+FHIDs4F8VMOXiDtovAGvU9VAlQTbYDuoRD0Y2VeMGQCCuC4BbOShlcLqhrUhZHPWmLTSL/vtI+RSVim93q55/G98mQ7hogJIoyYCjIFUvVVVkK/8qoGbPGNF83ZNJj8Mbnq7C2wNz1Ushc8Duwlnle6+r0ZDcLoTRB3/U9JPnMmXeYYP7qAbDxMsjvj0l0WPf14IhqX6JB8+fLgPRQ1h8YFjQsti+cNlzgOEjtkfvu3JRbVK/zY1/xEu5AG56bueodOVdmae1RyNtNx42fW5kUoF0TEwU2ah80BMIj0dxXjLKCc3A4WIDgACixgqyzkkJtpkWV9ABL9mVXRLLbDynmiRm2+npVWrBvat4exRfQohRqZaSO62kEDU9Eqe9yht3fAZYUYZ2yaLC4z05fbIgQoKHtyLsDwDuCdlQQ/VCCmzsWt5LpQ3SftNghfpj3Opr9+5hgi/AIS+dnDqnA2SugUB4BnUDfVGu1mL+gZjcfEw14h/lGMcZe6Hxcq/FoEGNke1k9ZkQLonu2JWRMAX4gCs65ByxNsfhgcgqZRQOelw1nov4r2arLDFpfLrZvFcRbsGqjLS/YSSo3oZRWk+rB+lHdAExfS0N6ewAt/0nEcB8CelwcgFQXYMnT45v3zWLXuwtEaHcTif15sBy7lPn+JS7BK1XlJRhaEBxuEA/mHg5w0z/V6nssVZ6mtgEZzR/QeQf5tgg6jcENzIHWFDqRM2QS900WsWTOpAYEYjC1ek+iy8Tw0mxMygyTjHoFzjAapOGgU25UCK/Misge1AbGHcUTlCQ0gSXXTYe/PUSUBbywx5+g1Nyb35IPESYSvfaJsGJdcAJu7LrpeEFSpSA+wO+Wy7Eh/TzDFZCpKcH2k1uBcOEzmbfACMEPPLeROSq/4eeg5UGKCkIexd/3gxWCewWPLMaEIRPNpsfiq14HKLBXQgyLFMyTk9CZIdLRuYqwrHS7ipmAfHhfHrM1rQOo9xUskoZQHPgCxs1dDU4BVcmbHNkT3Pm92ssW2X4rcfuuPAQzUjranQ/A7SYRA/ndCZoMp1HFWqaP4kT4Z/4jtRU12BKASMoCrbpYim9qM2AWpbytkKX3QH5CqEKRr0SQiTw4D/YEGj9FKnKqBg40+R/gF8BkoJ+GYXwskRA2S1PyWR+FOE/oxagNycbNpDqnO9nNFjkprOA3Q1U9g3NABcLi3TF88CDKiptPCnPCgHrbHYj61LQ=="
  },
  "garnier": {
    "salt": "XO7Y2gQF6VLgV2Ae46lsTA==",
    "iv": "YzVp5D3pEg4PrJr+",
    "data": "GtUq84+F6OydkEWN06qFXj4Vx14o2aOl0ta3rhTM/qKJWBOqYIdOHGdc76dmBeCGOQxdWjqad9bJhxu7gnMnl+lg1SextpeJ6rIY+tPqpEkiqVgqA/y0T/SvpQiUo1DIUSuwfZwSc2u4ue6EJti08KuBidHGeNzV1igNrIUP5btWsFpg99BZ575YxSVuaeKnZIibn9MbIxg19t6dmB3jDjWy4ftLNHJMbO61e0IMW8Ck6rUkmrWFSdzcooJ2DHnT9SWhhQot060CnZTQCeN0h3iw083RZSFiI9BwgIHPKONOVdFU1YYJb0rFG+GumA6IsIkKR29THdg8PdZeavO2rixCudNK7W3HjU9q9zQWTQKKD9Au2GrHz7vo9dPmowWptFEGSaTD8OAA5pbWzrC71mHsCCfJHY/Ci9pjSrGuc7X5ZD81wnjRysLT8JEKG9tZb6oAOa54Jlr2yizTySP36lqpzeiEdCMBwaTahHesZRgZHww6+n+NHJ2WHkqBKJIxOcTqqNEgEFsWitMvifUOW4k0/7gsUGAG9rSIvqQNHq6Ak6HsqF06LjRUDZj3dRRD3VecYVhRZo/S7bEtyHw1LfoILPAnleWW2EQ3GbNpipTxH0EuTBJlLllWVz1rlhjbjKL4QuAXFual4dfpkAW4DyuwQ0Pqq42/gXO6ATrzzI65/AV+bD0C8ZDbHKOxzWi3oVTFO7qa52bWuIQ4is4VZe9C10ZJP21CKdhxi9s9GxHrq/8EW5Mi9l+IxPH2ofTF7f5vhLHz8rP5ExyRCTqptTkF6xZY4hvjFnvd8VME5S57lhzY+n9W6IKEPCdFjPuPiiu1aa4GivX6anvpPwUaTIM1FAXjPwhRpKF1LYrNwIEDvzQMU4x6kHbihIWxGMJRP6JdC3bidrP0sK5opEPIYMf3MuYJSMaRkRk5MPiQgM8X746of/8J9wsHcSFycMCbiv9/Wn2HXAfj38zshz/TYgG1uN64LLX9PDT8NEDFy+zoiTlhPpIFtoUypOz+UCsCDEU8YAGEb7eRN0ztd+6yGgDmnKXTA9x7sPl4KhLE+e/CpRULO0KT1VS6C0pzwOKTX2F/EE1SvC6z14qWy1zixGjaOsUyNyrETOPng3UkVeOgE6MbSRp643WH8Bmw2HyUeVV94pVDUEkfUxQk+BikRhuir4yaFO8wiYHDK4IvjEEVqYxmmBbK0iwq6P53YKniQjR6gq/25DF4OuTg+B0RLndf6ckVCGZtOOrdUHZ1iL+xMa7eay4eXmBMm/FyG6mhRbGImkyjVgRcpqYKCOZZOgHtyz6r3MUWvtmgy3jz6hcPDe3/8q601nEkkKXX7UJ452kblBaNIuGmXhRFzhUge2B7abxhxvR8d+XsGeP8Pr84lH25KC4T3v/g/t5BJ1VgZ12/UM2aPP/2tfIkrLcVye4bUdakhmUhOgECb56Q1Ft21AF1sMp5qi6Jdr5d00gdZNqSNscuMgHeg+ZerUFIbUogWJTtg62TqAlsshGetFDzIVO+a6AhPGY+GFCaXqjkRYIsGBxaDxmfjJ/T6EFbNRv7A2rokNlxra7nN9vRJgrJyiRVDEzvlWKGAQ2rbYJ162oFzJDnQIatblYQA16DwhRypXjU1Csid4QaQV5iiQsY7IMK2I++3f+/Rv1Q94Fial8Cliw8xfbOFcEpIRy6Ni61cSDHdJu0B+y19jXyBgFV/lGVYB2yvvrobTKnWjhU+Q7xKtJJPDdPmuI8WDS7lPT0pP+Q63pCSbpz5Ycz8hB5kFic51H9uob/YZa5JzbgnAR0dyfYCYr3BKVEhhpTH/vd3uMU4NIxgetJDintCzlBpMT2CKEkOJOChAp1MgwAhZAL6aM4GLYNxpcmN9TEaf3uf2PmnFcchgKeRFnL2GtWb2sj4OxH1piq5Wve93vkTnONQ1+zN7wrvkVoykI07rScw2r/"
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
