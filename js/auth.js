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
    "salt": "POCE+UtgotNddVRsiRuQ+Q==",
    "iv": "oWM0BYg4Vgc7a4ud",
    "data": "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"
  },
  "nguyen": {
    "salt": "gVAxKJvr1IJBd6ujb1A+gg==",
    "iv": "42djErRCPAH6hDzu",
    "data": "rr1/uY0/cQrIU1A9Lifn6z1jzgwviZRx09ZdxEmqVkhbPyUpZJzomnxaYabh3KJVD3OmD6gj5an9NQzbuyG+FmYEQrjCU7yaaIshm5W7tUkkvinLFKyVU4SjJ1uXZSa0zNeoZ1kzdR+ogtYe57PZ/eFGnzwhZ9Iu1Wn8lygtz5io4ezjNAk9mVM8W9vjjzvaDr95Z7WI8IFx2qH2e3jyHCqxOp8D2yPHiFKW/LtyIcISNOnvWLaIKeukZzuAP8HoWxgSkN8bDL59Q9PTTAlJh5tuRJJ6wRbM31mi6gJ7aacQUGxQTghJhXoi+b6FuGze4GX++hIv5eg/Lf24ioeOCEeBR334xREDmAjBlM+c2s2uVRblh/VL+wUr/y4fjfYXbwYmr5j5QXYPkAJ+70nlYr/D6c/KKy7FEVwLWnEH2/hwXRxlqfvyFxq3T+2MRft/ACWXvuWF3YRNwaR0OXbEf1XHI/omZOh76fn+wq9P/lufnmguBL5soE+V1/vA1ymSOeolDJ3kBohFcvCZ1P3DazRi5x5qY8uvrALWt6jjZCIGxmxboySGs/0GVfkMSmgLdsfh4RBMcw9m6wdF+4P/Kbr0BSL5KNJSgIW3wIhJBNSnm4ql2Gu+Ic1JB2p/ffItez0HhB+67qKV27DMXoz2T3hmWxOYzKP1U+hhM/oUtcbevc/1FqB3yKwOHn00/hfQiI9xQxDrkWh2Z7v1CM1cBSpo2w+3hBpo+E+v2GTXJMwCy4p24wY9EzVqcdRTo5rqkndenzNSOqXqwhU9fdBDSEmRNRDPgKmXVVqW1FUyFOPlkUa8l/pU5jyxXb8DVuqjfZQnDHqILDLw8OgNTMBTE9TLv/pY0F/KAP3rRlTIICFh/OwO9TglNUiVAxrZ2/c4+1aZC/QgAlWHPX+GMj0FzzaclJmwlZ/S5ZF/Ifar0QrWvzxFpvM9BI8fcWyxGNfWVMejgcXVuYWWybPQ5vEmTfJSzGaYoz/5M8xgtcYlNMJgdUWlDfg3wS294LFvPYirWrQWWP5QLbCyldwQgzHua7NyaPQ6vPA3aJPojflJ9W3BlKRd2aT+OwpW7dJbQK/TyR48zRtOlsLMu2ZTeCN477ZWpVc6e4gAauFEBwMBihf4WhA/WHS+r6nY8fLEmY4iW6K39vGmmJ1mH4h4h4D1gogCBd4YxaNgCLoSXRsEdwluk/RU+DLiM+rJfJSc+LTImmEQfNi5bcK7gY//GBkW6QXt+P2/z11zh69YwAhxs9j6eftg+49LByuMxhq+/smu7oEpjf9f1g1tMHuxjakudrevFtWYvoAc3YPEmdm/PBD0Gq0tjJxVCt1/tvSww4TqlTklh3TdaQIDoD4bGqb2UTWzTzo3p+6p/JsPId/sTySUZxBTob0LIInLuOsRbSVPuubp8lCKTtWYAv3cHpYnOhIkmyMESPhr38MtbCf945HQzUEeAC4OyZYgMMnv3yyP3IE1zX7iV2fDZqCKfNVA8gED4svHTzxxBKW0K8Oipk9PrMwATQ7Z5bmCHyb6gk7JzAfiucDLN55iSVAbgs+zOVfFJzeRlfybIyVYfSTc7+Ipm3SHwG/UL8cY5OXiKFja55mEaXfBM/oVI+c="
  },
  "dupont": {
    "salt": "fdpvpoCZgEWzJSZ4k9y7Zg==",
    "iv": "7M1Ua+uKSMGcK+9i",
    "data": "ZDidVMEd558r4gup8T2xAokIrb1RrpPB2XIYZQCDq7I0HXW1J5L3FINQXouBykvKWa7kIF0nfCTfXuQNpl+sdqaNs6eWTYxBiWeR0sEsO3D07A+eIhKRGV1yRvxy5j8Rg5qCK4q3oS5HyQIALyhue2qCXkBWVnLVq2gpoYVsbaYle7jxOS0CNEKP1s7PUWVWERHNGZJZgaCGs71T7hf/o1LBzRNnNXgkZESR3hRlIJnJTmwnqCqqNfIk7E+DVdiRamT81Gx4rjrsCYb5czITnYj3bGmGeb9sKPbC/fSaYBJK14h0UFnpL8pH+HxQqYhbiOBrxvaFx8E7+wh7mi/ZWrtX4HV2CvrrC9HD1IEpSVvmVAyZTtsQled2PV9icWfLt2Jsy1uwPNUO8DZuppVdWBEhNkdjuOsgVjy4+jcA8SPMavid3ivIgXM10LGPZGjod5ULhsi/bEJkxkKqB9MNyyZ4EXMT09NLlaUqktCMvjZtEAmZJOraazsCnaZ8cOZAKdZN3Nem4cpD9kgcSoQvj//eRsk7LvLzm4ZYM4i6G2pyg6fljbZu1DQJ5VRLu0/fPNtlraJxjRA9EUuxwzXSFFKjkbYyRY+wvtXdtHqeYx1hVMm/obxLW9ncEmPW/b2NgQ54avjkJK5aUnpp025YjrSx2sjGg8BEdV/M9yy7NDm2Uuwm+MQpHIhcI7/U49D9uOSdjqmfr+CoJ8D56fS4ltPjjQacpkRv8sknmnnnpDpWFdyaBTRjoWU7KCTpP90pi1WgqWEQ1kvp9tfHWt2bGHuPvlRJVowGUSRrey3QJeyYeA3pg0xU/mmbJ1FzJEGUCGL3hYyW4Xgbg9nq7TWdwOC7FZKG/2XYlVImVnakGCnzNWBUpLk2RstZdvujg5KzkIt309AnUPZ54p2T9xUm1uwS7CRcgDvIfg8XUrT/z1W2IplyQMIJGtMzVUMRQQpqarTwTzgNtIpRG0Z0KldGk66JnPiJpsvgENSzROP8GhwSg7Z8sELyq0ODYxiKGrjbUEnzhjRSxpmkOpR+RuYnQ+PwJxFFCYwLTxCW6d1rcf2DOpJHFKpIhaTJI7iPbGpXt53IhfwdfdIjDKhNCXjLdKDvCNhXZpmyOA52z3B4PxXe4nO47YUg6cAd5grBLBF9hz1pIlOvABLE4zrYbRyxh0czUsIRNu4eYGeaARDHIC461XGpuPw6D37pONB6ekBBPKiYLV0PWeb2HIUdtKkJxGWiPSleize2zvnWLVDWZn7a1y0noEX+nv5LvzOGs6Nb64mU6bJof5+F1OodWvRxI6t4izcTI82S+cZFnTdI8lUhKtYR6BkCb/xQWd4f1Wh9wIkTdEdctlS2Xvz07qRiSe8BRy7boAiXqhfXCCC7MZwrFJJrfGRLl7Al89JM0kFz8e38Mht2zrsB7Z2lTaNVtsleRCiY/rLV1dyg4qaZiCAd+yzfemd4Y0vXobM81KRNAGxy+ORG2L0TIYB5B2aft2d3+eDyfpe3HhO8oMEkgXRF2Oqa7TtexsiFUg=="
  },
  "rousseau": {
    "salt": "dzzx2ZdinZwMTL//09B8Gg==",
    "iv": "ywp+whCD6c2HzqGO",
    "data": "2l2wePNjGmJSI82MCXdC1rFxgVWXkwGng5UVMKIUbxKeYAW9RZoiKTRA+i8wbU3WOv5qUtnw+qeHB4gUbK0FCYOHD42oBkyDPCvG9GsCyRILftnjh/P9jdNTxCjDVf/+H0Fa9qrSUqU5pytWqX55IDM2XcQjweSZ1C4LuPhKM/GRkmoL7gOyQmnCf6nhcnR2EOw039Zvis10AkXMDr945UCCK87jHt22brO5oq3c2s2HD0ihF+SlrfZSlksKiXDyraUyuMDrLmFnYsmS9d3Zp30/XkRLVYe14fh9ih0ABLTYusJTkFfoLfptG+SnIIeFTUXXZodcFKABZGuurHigO9mIOs5vrBP8M94ufWqbx/BW01vlcCDlZvMZqLTdOkTtwHEjO1CEHJ06Qt2r8qQeB+QRZP+5KtgBORrSX3LDDZtozu9B8iNcPc0QDMNFJmkK0OtEfVBeR+fSSKGpMWXNo9H46abv4v+fXPXQ0mWs3I+N1jtBw8BLWJ+DVYCRb51YctL6INyM2Zvlr9weuyzjWchS1rLdbz9DIpl/Q2O/PGGtJXvTNsMJ4djHt8sCTmP2tpnz0BF2MAubJMoAuM3GMo9PVE+ljMGSZCTUu8Sl9WazNN6JShyp5TngGRDXB8fYgLA3fyIJKlRqw5UxPZjqY/BDC4NIqvTchdGyKZcbQwJ/xiBUz73lfA/vwjsLNFpMWrlMYZ6kEW0bfMpc5w2uVI+X2C127V0JohBimSbnfeF+FFijkYn5Qn7TJ965EywK6pAYB2l6ZyLGzLalNelmf98HK1Hxgd1U7U81ocgtY2WnzoD/mgveaVKCQgKG8hT4ix+NEgosPH5r7gT/7fZ6y83N5J6uhlxYsJ8KyWEkWhgGRib9dh37aYpYfD6x6PFfqii4p6s8afi7IWylW3LyW91NqesP/rNK6z3EwRENa6j9GX0KV9EMpDgZ/kC8jOJl5XyfLwQSSqgrYJNtY84w5F0yGDzNbqrDplQsGe50JqgVANS7ITOQZygKPQGio67qV4kYYfzJS6H4V+LDq5b3qgey64yII6xlL7Cj3BAcawBhkZw4NEVY1WVY6rn6LYZ1NREBSjv/VKUZzju0XneKNIY36ODA/5V7E07ATEcGR7HQwbbn4coV7eJglgWR3WhQ086T8JrBWk3K+9oiYbg+kprWvMCkLKJVMLBYOfsUQXTtbK3GNdnZ0MBvEeKOoVwjweezQQk1RCX0V9ENqZYKwFxcihsqZomAEycp+rtAWHkfYGJdSZ3OV5OW0Ou3Y5/ThmDEhqDn8pvQkT0FPzkfDv9WPlKx2+SIqqGLg+xkQCzH/UrsbTofrQpiQK0cwfWuyxla6lI4r58VYaiuWQSvMZNDeYVN+SI0N5COrelsLMsj6lkpYyu02vm66/xGoAEQRl9E9ZyHuz3BZLq+C86Qfp7HuASIDBPBfGyWkbX56crFC115D5FThH98aIAdl94kSe9rBbLcrGYtMNuxiFRPDGQ7jNCjzRMJrNm/XBpfhN5oqNwy57iLm+vRb5WSl18J3vbViSj1NzhKCGlcPcWKjc6VA0i9BRrMOP3mHnBx4IFABH5zV7YtBO756RkvUZOaco8CaivZwA66L9wp"
  },
  "bernard": {
    "salt": "0s4YMU1+pvNjwZqUXlJnlg==",
    "iv": "bvjLPzgltoVi8cAL",
    "data": "Y92GX4qAAeP010+mgfZ3iWS1E1Y3OS5nEBd5F/qb0KHmpBOge4DfVh3ZgFW7aH5sEQUGniAZjSPJLMoRxqwzYIWsbhYCHJq4DFCfVokXrx1njW9wcjVx8YCB9jsT2Su7eBf5UrItREH7VWMD6NAGNhKTWYAmcjp6cSx4H/O8DTVkMtdaWe9hZt3jugJN21LaHsth20vxfeUn0mmK8TnRuBAlftFgtfn8rRGgdzfY9EENSI2bdcxN1BtBPQhne1n1EMQkZLE4jXDnoQBP2GKowGwuwNXDCEtjYpfmvbTQPTZJiRzKD7FPtEsfPyNBrm99sOKW6b9xQkbYG64E67IVlSK0qrMGUToV8yaxrDJkPvWl0CFY1k+jt1v6ykSzSmUGmVvWyfKs4edSYb3BUwAd0PMOYe0qZJAki1jGxNBAqXHEkmzjak5Gfq9mCm+hCAV3Rbh3d85yGMUtjYiI8s/2VKfPFn+uHPx+kzEyaFexeqvV2fNoJw6CTiUgpIqF7UI2FjpvR60j52na39qgXrRfXFiJCovFIvOJnloGmAhsMd8wOmzahdB7P3zhupK6442aDDVRvRGlZx6ViDBXCJV1EiBtDqHRv27DorNGE48RTP7lNmgb52dDphu1qDtikYddvHG9Unq+vIeVgYCZqSc/e1m4RM2qBl0wLcFRog0fIeGhonnFen+Cvt7dI2D9xm56wlAHqCJgundauZBKH+3EMB8f+IWVIMsmlQhLooaW/IRPlKJM2NxwEYTyo3EjyArWApsu3ZmDBuVBsQiZGqd4jY0fUli/DLpt4thR8VeounPa8MvFf128LFq8kggKwVP9sRz2W/SktXh+q2tm+L9jEXOLbbNpYozmyBLW8CXQiW9MwL028KUS0wGVXzE8Ut1BcG2pM/K7t+buLbOiIx90EHgXHm2XhwEKC0gaY+2/a7nkQ23aLVt1OlxnYy60xwK7S2WkJp1Ugq2Z864IgrN4iEvW2HZbMQMhzvn0tZS92u/QHdxe5a7Ik7MmFQCdLQDlJZ8pRwpC+BEwmZibpXXDUqjBFabUgFbgpa4O1YY9YQ6zQM5Y2tgakBZlwivrngHR7sFTUvg9YUVXDPHCY8jInbR37pHTvLuR+ISt15sDKLSpI+eMlIetu/bInxwA2MPkEogPOUs8CS61ahwCOtJcy+iNgmjWRx/9WwH6nI+kofFa4G+Iq+G4UTi3UBmNhJlpRg2BhjmKURvum0eOumbnkADvVdf7ZZnJg1mCP5k8mLo/dWrz6pO99ruKs6eVwnpEAWa7KnzmMHf9V7iihjcABQdgeECHOJHnh3sGFGxsXCLeZbkeEFnfYkeEztUx2lVDnV4d4QfCxfw1Y88/mOWw1qvuraUwe5UPtAxoj+x8kOab/zdeIhIokaAyebDZ8/ItAnGzMbN9DkVgLNJIW8g05ZKjP35mJpWl62zi+5+IJQcOIA0qUeDZ+4tRoELuZh8pBiqeJdpq3/UJ5RC2/sOFRFyq4M/PjRqxWE7U3AwNzmwKQ4BWyEVmOSTHDzxaJj5B8yDNZWf2h3EAXTkzwODul2UOc/9YIVgNdHwSUb0JiN1jGpjIJFEnQKrEEpnoKgVHuS9EzEKaF4gwjoL/iQjQZD7fkgBfObutuoSeyyU1/lB69NCzUORwO5NCPrtInmiGo5hRBh95z5S8DM+NHrmQI8z9kCdvkD2LGFmESGED/xHR/tPJAUHTS6hI2uBaBUP5nMmFwfJkrv5MFvu0xg3B2w+4wjAWhtrYRkGeLEP1axmUQiSu5ngqu0tKnlgyxFGI20M1rHE0/x82WFU/r4qfOozQjIk843o5/X+3gIPSFctDIsb6dSRUEOr7ub5ryNApK0WdgrhxfA1BuC5HdMmKnDkGY5KpneYEMck4HnwnAXUw8/oBVdBQIxTiHX1GVrP5JYIuF0ECyVDxhcnfNKkMrYr1C9pHlc4QuPYg6XjYrMZrhEHs3oYKu/oSXNtJWKFjA9s4qSXhFlM="
  },
  "lefevre": {
    "salt": "KRygnqC1D1JHTz3S0RRRMw==",
    "iv": "AeqKdqrx97sGgg+p",
    "data": "Z+BL8jXawy2Mxc4poyoZ7FLBErAT15Lz67RxugKiK0CIir+iubqFZND56Dxf3pYbDz99uf+Dly+XFfFfQghFC2RagMzA/Gint8RKBkwrhn7bJvFW7xse8Ws8iHcPrHq8HBlcEMvOah1JVfZauxLw3PDcDeX8V38JpC1vd2ilCxSh0xs3lKl99Vbi7yrwk2tZHk4Y/u2R4Qnw4bvvq+3AciJI6p/g8BbjE30zAKfgr1oRnTSxC+83JBGyFitIQqQ1NmgcRjYw36GT42SNybzclyIehf/9GHXXQ131KFbJuUy7GdeY/wNUuPZi88KXK/I9q0W8J9Uc0tHS+5kvZnWrG1oacNPM8tCR27f33g/UvcicFHdqsNGQvAXevZ4cdGSTAhQzJSy+LYMZ8B0yTSwfiUz2DCyJwswAEFP2Y8awT3iJwTns1K0ZTLUmpgkgDtsFPSQzkc5IsplqGbpsLCXutoeOFVgX7FeyF5l8XSofNrFb3Cy6VBbdTGi6q0j96FA86nuFlLvFTB8BmUSQGMsXMjL5rURjo0Wmm8eQUoSIvdkTGx2eI9nGu80OFexDmR434wBPXhs7lHV8CEzLBiJ4lcuTGx6H/cjJz1Z53Bev7PS2vwmMbUCZzU9zJLYGxcCR9k2/rx/mLNH88M1linvnjRHhq1JWjBX6110FHQiSRs1fwlJAvseanS3Or/95DjFulvOSV91JSB4aNWUQ2qPLxog9E2ILyNcnwSAcG2m2YYnAm9fLibTJ8vc1fWmS8fELp6x8Q8WmDx3+GzT3AllGJKiHOcenQqEiruT9/47u9KQ+UCBip7K2icYzK1nmJ0oDZRRBD3e49n+iruur90CM0xEJNXwN+ACBxcyHR+L5y9FcXiFId0y7iX2q4DEbENWSszmyLiisaFfQhX+1/jVTeTa6yRVFHidO6PUJS1w0+SsrN0Zo2a8i9zLxzk4olYEjI2sYzzPJjkVbgqGmKsd8+L4CTt3X0YcVonenQVHVGkpFXqPwrkeF5LNwambdwlJgqVsVJcxfJMFsPmfh2lNGzZL1vieKWp0E6ACxvy+9f+nG7A9uakMlKonvfzSIwczsD+m4Uvdrrq+QKFkXiYf8RkGYmO0SBQ0xVbEgKDMr8Pn0vSYjAuiNhNxR2vFpdsflbt330AF/H18eN+90iUAibwTVbVJ0WdOrIcnOvZYq5fVygm6LUYKQ2a26cKeq6jlnNTniD1Z70rq32i4tnDEWRhGApjYCrq2oQAZp2E4EvSOhITQSBJBD+gAuvEK7HXbxXZWcvDZHQ5LeHm+k88G/lr4OsKIC53AsqwPtAC5HXNfOWBCQhd7ovS2f6CTL/Y4Vkf0qFXI+Eu2NyPv/bjaOfqIpBQ7AtVobOStG+PRaftmQyb2jgVGeLmxD5zg/4IdviMMWw9ROgtqFp7glbaFmibXgW8oXDtgN2T7hCSsXcaj3DGbsWmVqOl76aQw5w61rUf9+cALfnO7twgypkKOD38xqQxe3iWKt/E3g4aTAeCz+sBvLmyXmi3F5tXSO0d5Dyuiy7W1lj+5vLcpboXkBrS2TXvqEBxJD+O3kKWYq8NrT6PDtBJAK/0GaLpL/zj/72GKI0IKSOZkzmlb7fdIG9FXCievNoLyXv4w3SsWZ7sBFy8o+icNo5jnHXGWIa/e02MiKY3YVtypqpvm3kH5tZ8E3xCFCMJnxfLleIrS7UviZD26ho6PqNSSayTcOMqQJZ2Z5s4HYMIzz/wRWNgO8ZsqLpcG9FJIkXmNue0GP6Uei6LBg/GYoNltuq+BmL0xPOsvm21TcZyl6QzT3F504M02/WtbnAC2paOUZlk2j386b3cbLEIIaoYAaCCCSao0E+NpD1nwjVTayj2qQZv4Vjp68HW7HqPZCicTY8STA7jZVWf8="
  },
  "garnier": {
    "salt": "xq2kH3QW5PkqEn0leOIQVA==",
    "iv": "4UjDgbCVzOPj0IBG",
    "data": "bji9BGLgkPYKgTVlY2up93OqJFUiHU0rwzFTBbf8pTrU35Qm3p7dT0PPrJb3U/QJA0E7dPFTm4BeTQj5Yp+JvkA2B0yqkVONCWvZt77nDHC4x5/MFmqN27IsE0nFO9oiVCrQFgvR5DOyDO8aRzQpnmlh15NX7tCFnfIaaYGLqfVY2eYTNclddKusnn8R8YFeO39VI27HoLyGOOMxfEgimAbYbV/wuvovWT9JUv8kY9CnVrvnsJhvGZzohrPtmJfS8IYIp71NAJqxiisTSvBp5YdqKgRHa9PkY6QrDujXS/NDJxXgwKZ2qCCMPtkLGo5hHw1xJkN5VAK4z27rV9vPgFgo66NIuJEgJZkR4pOsnnnRYI2nDhpfhGTHHeNqFJIsYlee2yLXiH0akM82IcLwyAmQPRnHVoYvXrkfhU3QNC+VJmTydx+5/6VpZ3Pv+5PaX1zwRqywcS87xzkcYkUpeKcTyRqy43bww5meCbEqtb4PpoA8c+yCxUj+5O9/O/Pab92Zn7PvtZzUgkWqNE4Dx4Cf3AMl6RM9OgSp6p1tXFjXArd0ZSSohDT3HEqF2cfPC7w3GYnZ4tTxlv0svR+SBwcjwcvYZXbR2gpji4SROyiYS8+sb5ZL06IXw8fvhRrZ+W5DjNfvIjnb7sgC5vqsHqnwWcUktLk5PxUh9/ZLFXlvnYO9vJieeU8yreclj9Rxqg/kqU7UYIyrwRsCjR8tdHfoQd5zVV71GlO5MVwIXYIDZU4D1vkHR/D9JUwAKVtBQ2mzczP3klYrGtHKY1OeSBVWtYzHOzd85B/L2M8jBAXdi8StY6giBjeIL85a48xN1mnLFHz27ldoMIwWPourGYvFDxRfWrjpOmrmjIDICFKRZeKuil3ag0LiqjfCEvql+9xILRoMJD2iYZEVS1oShVpInwqZZ4f2q6TBe+e+P5QXcaJ4gwKse1Hob95GY8mIdB/mo9jOOC0MW4vc64EG/L0i0ZhdxLKt3YdQGyYfaDiSaKTDJZywPslVZyNfyC7s2FazbJ0+QPvIaUuDhS9YHGAYycmwrAnkqzuHr0/v27Iys1qUg37B87Xd1yRi6A7/En3MgrZBDcLVlAmowMOy/bdTbdHHxrnd+s/wvAcU21thpR9w3uvH0lqJt2fLtZo03qu4nPubSJHqgSyKxMfmZ2jMsPDBaaQQLixViu4sv8S8gumMaGDfAxYKHN+hMg+GS1u8GRJvIqt+z5S0YXkc2gOZ9QO2jAyKwnSvPQ9PMvSbcuqeT6AXqfzXNwAQmd3aRRQdiMEyu6CUIIRGs9NmqJFyHXXw0S7cJTXy1xEnGgyrrCvIyS3nyWhbUWKkXlkdSRLSEqqn5LGTRrTT9Tu5X6loQkpPOReThGTvYj37cdBYc23KoqGizbsZ7dF4hWcjktdlaa3eyBHvHH1ocxMtcDySozlZ0NkRU22bvuNTajpxWnTT7F3KcaLSNLdyLeB2paNbCc1oJwPkVvNNLmG7+IE85bh7WEcpYjIEfaNJq11pJjrfOUsVgXy1frscBNazvSWiiA0AhCHLfRrwDoKQR75dDspgMXFrOkJoFhdfdw4NpO+NsOTSskxLBb4kAPGHbZS+J3dW7fkchDyScgJHRRQvhhcGyFR421Ww3Gr98GMQcRUVQfA1Lx24uXjbysQcLlhOgfFlfGAS7Jho/qiQVTMSfLDEsA4pStTEZw0tYqkedrxxjJaMUeKa0G1AUKlTdMGmVJLrS0nM4xhs1kgeq4pqpUNMTfROIb8Q3iTPdMNxB2dyUoFOTmzqxdWgRMtDFfXE7LHYeFl8w55DBHsAY/GS0Pnx3djn3slYJckhNr3vInpvs0Duy0lKMlUZeGxlKeQLAP21g4nF32zUhVSuvnhiLBCt5xkFCRz8D22oPzlu8pxRn0ftPFkzwvy38OkKN0HFob7udaoJrb1rlEGc0C52E5wQ"
  },
  "admin": {
    "salt": "7yhfORwAT5WeWGM88ptZmw==",
    "iv": "+5dMl1W87C/xOx9E",
    "data": "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"
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
