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
  "appt1": {
    "salt": "rjs95KDlyhd/hZS90xyDqg==",
    "iv": "5EwVi0xFzXMyMmON",
    "data": "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"
  },
  "appt2": {
    "salt": "QJOq/FHfDl1aHhyYBDnGhg==",
    "iv": "3k3+ohADShJSvOrS",
    "data": "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"
  },
  "appt3": {
    "salt": "yCoTByuqd264JzVyleDhZQ==",
    "iv": "wmMlfQc6/eO6iZeK",
    "data": "9IdwuSepUFJlK2vZLZDhwRwEZ1SlkiT99Du9sZK1nOhdpXXtQ++nKTs5l3ELVC+VFN6jY6o220FBJ+FTO+lji8ioeh1gsMj9NmNgsDYN9FXvwlktVLwftMJTCxFkVR9Z+0OZMwc0u8lT97bOcQ2NRhMZLhamwCZ3ON9Oe0++LlCbWVR5NrhTXnFeWBk+X9HsGgG1EkZ2PkjeooWkqenmIen7kebvyS5U0PpkBePAAnUtjcBDIgcvShHrEDP4jESBMCUYBXYxa5tSuF/2feSxwQ5TCrDAF4eA8hsEUtGfDL41ML7pXD9iIWB1PxJSspIb76MTnZnQBwu+EuypPbKnDl/z8Ck00pJ6g8hnbK6YwCQ4JyzHjR0Ef2F71chRwk/hudoFXdL8/i4FM9E4P6plzMnqHhghdbAeN/G1OKP94gbqqdjzbI3pLKfv77ulw+0Wr5ZYd/bAoLvI2p7ONApnbT9WAkXHse9ajlppXNa3Fe26U/oHUfpGTiXhAfiLwSSmLvt9XUhRGz9NG+dj4opeiLyyE7kkpE+MTfQtDzWaWwdjIArCqcmA7CbADLM5y1HJa4fTYx4KHZVR77aHlXFJEx4PvrknpBNn7AEofp8MKqNHplc0SqIL0URKzmVtN01HLZ+heXOCWTK1JdGkwQlAN2Q4riH5gXUmXFgQTs49Jp5xF2dogI+jjDIkl39NbqldX1/2D+5twULiEqbiZj0g6pcnZt0EfxxYbdhV/GSMIOm1mR2Crl6c+XHwrEcEspYWsKhnPf04iWhBGPAxv05nrpDITCl4Prc3mAIToHiyrd8cX94TVelGOtDPZcLI5xy1RB7ZMjE1QCDwjWXCS5862Uu/yx++QhcSBOfLhDaBgxXE+VNjTqc+VZ1v2vGK+yA6Wuik/I2XuGaw1tGR+e5vFipgp/mIWYgS9LC8bbdtmbNQO6EOYyUCnki3vwksUPBzxLJanHFtjwuj2IWN/e9ni7S5FJCeOzErbbt4mVxIardzqyz1+KPsLX0iLNo6b2mJKPe0TziwwrsN5KCoqFXHnPbPb98qGN4pcTPythXJb7PDO0mySYtP+dcA8nJ9G4pj7m1OysXMV1YJ60wIfnnhtMAecMMqhIY2BMdLk/atX/foulRekTEf5W55xRLQiOgE7TRIX1EbCa+Re21ooqIxizASWG7IkMP9UZCW23+RhwLjrXlY3Xbrz7NOraIwcpWPHQQxGuvBr77/1/HI3xXlidzw+AXZgN+snJC7hecoRtuBsvLrwo0UmztkgPYpuWrVNRPCmS1HDSlkgu//DgV8+HMS7AWgJvxx43lWdP6GHEe15IRBpd2UDzs3bVVzJYIX7FsymE73Fm4N+naO/xPf2uYniyFd4lYGM9BlpJK3DL+TBddju4cOArfW8/KABifedwRRjeMfNu7DStza7aHYPulynS1ZQnQ13W7UHxikWD2xTU1HSftyPhIRGUparFSjT2l31IFP+UFC/5f4fN79vzDNb+43x6jHM3ovA97gsimJtnRry5+dsMnhqw=="
  },
  "appt4": {
    "salt": "04APVzKCRLoZEfa6fOl+Kw==",
    "iv": "YpSi3Y/JNGOKyJJL",
    "data": "zpKv0wjSlBxDnSnVEIDdpLCp+pY0m6yYMJMHrnnY1gtz7kPrJvtRk2ibLYfViMsDaD63SvIqQa0utf2W7AhvPF+ulrDIaRuk8o/S0H/Xn43QPrq85jhsVcQa8rFK+S0ZLSe4mP6tyTdtFlFOeHdtwH9Ml/Xh/8BHd/a6sYE6nwYYjxMmsJA6fUbviYHmCK7yQjCAcWaLzaqPNaStODfCIXwLOJOfV+CRRI38F480Mm2y483c4Sb2d+RSvHo4pbhA4x3oNvi3fdKe/ErOaKlGMdXNL3LxWVetePJYQ5ffwiqtJV8IftgBswfNfKErYUgXIJmP/YIJwJg3ho1/ZYCf17eWKZaAqfSXE6YUF1iROwKISCNfo1s8gBXGr22KwEXA2WN7K03HmjID0ynPTI7u4rxoxf7loTnQDbKUJmds03N4gaWYBjyQSQm/dE0k88rJoyp7iCHCLtL2yuuD8sQA88kv/r4Grjdj+u8+sBMWgPh9eDs1h3t0CxMYZYoDpg1dmqwsCc9jk3lB0curNnSB/RZPRffcFndQiUbUiOaH3gAMyN6KAKJ1oNy3Q3JNGMRPVyI+Wvw2CZNdaFpRTSbx5I9DNbuEnoTHsRNeKPE35pZbaG6hZm5HhT/y192EzMrEkDjKF0+QuTxpw9EjVgimWf2tR0LsiFlQY7pJPmNa43c0FlFHGkFt63pkRAk1Gvd5PdLpUnjvplXZmboq2ppCZqwjI1tjvkr9eyaAVT+C7eQMHBj1Q+0yFCA1csf1bAdbWko8V/QJfMNPzke1Mf+MsshEIJunLzHKZf8bxhfEGaLIXCZkLu+E+i77Yyuek4XkNo8a4NWlUE/rzcsJiAAlZK0JodJA6K67Ea6bzYdZO/Ym+kcH+q+ED8U1mkXFmqi4sOgzn5ep2TR2X1hjtLUZCpBUr7UG+KbMIfqoV3lfgIFoXFN1bOAOAGm9lpeePWqpmuiKEOnsR8ohSRy9pbj1cQeX2FR/2E3J9cMh0C7uRfH6QpNoAMOqA99lVOD43Vrsbjuw5FkwHw2u0mlpT0GaqXi2Q9q/2D1SzWKnPCRdijJgfntTliVVEeZZeaN0ikLYBK9gTpmW7FoKg94O6eCPO4joue4PyqQbe0BolZm3yKR3yAvXSq3cP69crKO6OX/AG34rYzKUGXPU/3ZPdiWjwRACtzFmetZrpeMkQ9+6l2tE1neH9fo5yY4aQvhksSDpar7tzSPCaIrm+8VFvhoZA+Ph0u6ayEWBVZzAyx4unZ4QTspYi3QU6BcLkx1wSdTZEvipzCpZMR+y8Bl4FCax6aI/nRXOwXiQuYHdIt+z0RtxHTlHfLsPxACb2va6dbEMh1BSZI7i2LEE6uvYR3F4CACnRp9Qm6A8MQAfeckXz335l3LJ29SiW7I1p770EOd77AWBBOrnxTMIt/lBPBiM5vTcfPtlb9m349Z+bc7yHRntK+k06f0QKusraKTfxKtqHCGTFYiR9Y4XkuMUWpObqokT6t2nJC+omihOX1ivOF7meFCWTlJMrQ6wRSmUphSnu06/5/FuiEecwaiO9tbDCCXkGaeioeU+hgfuGKExs1Bg9WmUeYxQZqbNcnLq5JsqrJ5rnj/w4yK4IETw"
  },
  "appt5": {
    "salt": "VZU2bYTcozefFbYuP6arJQ==",
    "iv": "JA12DrMndV71OP0v",
    "data": "3UtP7Cmx6v7LdgHLYik9z4NwjO6DwcUXmqwx1NR97gVq+boQi7se6hqK1pdOHFlSyfTtKhO0fVKX+BsUVGcrOt9aqCK33O0NXJmryK/bOyPkghYgQnXbeUvsC1TWjORoM6HU8zyWNRX13UwmSDBRHaRstuoUqKSUEUzZXE2IzvlxVCtyaPDzNe7HY04uLGIBteqtuHC04wIMVMzPSraGkmT8L6fzU7QWzec4fh5NvaNVIvguuFVTYq5bjdrR/JDcd9eKKlS/CdakvdZphQ4XCs6xR+6KEIVups+lOlIeF1i5t7YQTACOyEUK/PBaGwGzxix22ywurUq/IQ30WAVXYhcuRI4lqm9z4jJ9yjn4iThSC+oiKUKyXQTZx2e2Em9DrgQ+zRRmZozenFGSthSaV0MPnMzvT/C3IlTqsXU+KIl1bGtd8bU7BSiZHdi4mQFRNxxvl2Nz6n0L7hdsK5nUbxim0KR8uhpEh9LCvf65qAz4ZDC1Qj7rmIJznR7xWnt9joOu3hkhLHVNQRJV9imNVvrf9ZFwKwzBZ6f7EZjHmxPp7vBQ8H9RWLzAMGqcpslON6oz8ZEWemQpn/viokPJE5oZNRE5Ot0qz4YbRZwCE6QrvP5rSrQpOrhlLlXb6v5UFOW9sQeYK8pvZ0uzykBEAWu75oDRjcPgmf6kca9MVhOlSkVAn001SDX4l4tNwFz9Ew6oszDVrABQjKofQzBP7lO54RN+vGXU0+Ww+BQJNK7I5z7gi1PV643ND/GH0moAX171MH5T7eWsnvoURpTSlbC7L1fdQrn8Wl3w+0wKONQc/4UxOIiVSBojnSDGrTePMo5IFTeTBzQtY8TvMkzNAQfWM2HW/FsEw8EZ5t9IrN3SA/MFeyitRVMRZkQlb8pHBgrwpDIJXPexh04BW4NHXjtpkV12Rnqwmo5+rd7u0XG8i9+nZwu1XH3Wf/5P8RSTBIVJfM4foxT1cwsKZ7j/fiNsrEFCpjbFLd4MWBjUrSQd891ZbmzdYsxor88WjYAX8mRoAg6xlId6Nwx0eNkcaHJz0qOiJ/UJ3Rq1XCd/Mz8l8a0SZzJbGkKdE5jrOOnS+0F1KYgyf/YtGlf9EPblxHHhLfesvulE+4Esq3p401ScV8AN+BTUiTUvmIrtfg7YkGpFLl9Byj1+uXfZDZ36oTFdfLrKZUhzkbFPbmZB4hooRetrwTNo+Bv60CaU9PcZ/LL8hCC/JDJOYxtXHrIBbGgWi41QRwHpPp0zF5yjLEUpiOBLxSyLJwsbEbbHmqfjLMLADWc1cjNAZkFTZGivTSvx+Vgx10dVgrTKjJDX30JgOkuL10jUFrPH5aNANCXJJO2R71oZv+H8HoRxttZNnPpQ1WHNK6gaOgPUzFfnK0QuZo/hdx35TR8OHsSGMT61e2sgYRhgoLuEctsfgr4ul4MtJ7CvOUxg/fy91nry6/A6Smm1QFTmm6jsXfFzQLVtEYDI0Jvls9mS2pbt9MBk+op6RM27WOEHdIWFpSPbhuUf/djDdc9nWrOJHPmMQoIFteCMtBaN1OEE1EY7BIntwSW25fxWgK4BSNmDJKuQIJNTSiJ0t5ffzJf51GpV+EX6Q2XUz0MqrdPY52rhGWtDV0qk1vy9/zvf5/MqCn1RMI5DcpBf+d+szA1Q5fP6Gbm+V6JDI9Nke7gPc+VHlGOXKzPJsDJZDTSPJDjlXuAz5nmtrOvi2TpR2Ms5aja9Aor2QpGX+kST8E+ctOmu+4q33UAnhXgfJ0DnUMEZ1R+9qMwZwgfO/CyQ7rSwHjBrR0hXP4pq/6T4jAF3FT5yucPaKr7F5d8+RZH0ckuk0REUjTicqScPIvfPgeqhDITFgfFXhIkl5LIG/CEQIuDHL/8Mc3mdypPzfuXqlN9munsBPTi7WZi2UwMkJqk6ybU4U6ZV26aBIaySmkJLBcSMIT8MgcSHhbr36qwF9SJN2jPDKrLHwV3MOg64FQadkd418sEFosglXDHLw38="
  },
  "appt6": {
    "salt": "WWCaZNFCHD875WRSNHLeEQ==",
    "iv": "8FoZhm3jsofPHmWa",
    "data": "yrJqUw4VjSquwz8+LBZzzydGk/83AdWvXS8ZzifR1i/8UGm1KBtpUzIwmv708k8IytcmAATXelifR00R0LXnhABKiJH3wC2mKwaa5HH2L/1S0gnED5xwSL3OSGXr4ZhvL+iAy7bm03LGBmNW+La2YK0SaNDRjhowZ+AGOOsrSsjGKOi4j9mPqXYFvJPx7gyvdghu1lG8gG4odIYKuFEF7+lW5M43wlBdDnkD7rVGbCv63hLpwx2mEyuJenVjZgKknegaeLZUzAfMWqAoxFWSQNzf0bQNNmoU1XzMvnnbk/BQAzf7mMF6ktG9JpYDzAcDri3htQTXFQ17IvOCohkDcF9iDw57r4220xNdDPMZ/qKixMN+B99RkClnOP5V/ipJsr36rfGqdtUb7Cl3xFffs5ih9jU7hfpGKLOKCZfH/buOvpY6HN2/milMtebPcnKM/lLLSI6DekjxeXa0Ryw/RUiKG6rP8pPdTdrby+69JobR0yoUDbtfnrHN5pYBL/sKdm91bTrOtAqe57mKWDVVNx4uLcruFE5oJ0QlcDr8dEuJ9SMu7Nr+4quBiT8atqIVaqQsnf4v3VyPvUCLPSxkSIW7dE7pI6NN8DlbVyMnLxrD37JndshrnF+jNqeLarge+OAI/KDJ2XdD7muZan0P8fDK03coiZ6wTuH1xspwD4eNeEaQDKMXQ3DTI95YbTKQ8okNJyOpDUojCmTJgB5qEHUBNozhFQKgbwphbZqvugGC7bcmNMVufc3INNef1fFwG/FLDA9l/ZA7+nn5UOrbisWcf37Zj7V01PwagRBK0/lQrsadve12ZuJdoEMBSNdw6kbAAwlr617XZEwQDTYefx8Y/AhYsfjeH9Zc27O94/wzPM9MpvuHF9keq7FcmDGwVXQD9yScFGIkrNxc1Fsb3d0Mw3wksVQMC8MRfSgk35Wk9aPjLDMMWN8o4PY2tijZfbQfDuv+IYdeYYUs8+AqRD90rlPRLu7fzrteM1XY2yyf8TFlcf8dtOxV3bhW7EgiL4J8m/f66lielnunhN0tRXWDDl9AC4zErhWPebWMSN+btaZuopN2wRKe2PvgDni/w4/nB/EpUz+MI/VvF3yIsMG1SE2vyuRCgT08pcBI309HiPOZPkQmSQp/ShNwipjra+GBOpoqGGcCEfssNdf4O+lPbohVO3RxOb+9AXqvsystPMNyik9XfWEQRKFvfr6KufXKBkywk3hKjWeiyFZkudC7Kh3JFawIbTb5P70+Si/JTz+yYKo9u03uPsoRPsYOY/qe0Po0lqoU+gyWKNb9ZJGK0G2isAjnfiex/k8f8aa5mzIJ8Ws1N5RiZQJNV4nSFqCveRmX83yyhuVZEHlqWL/5oODD0dZo2HSKf2DWyMOKa0lXnjQp6Byc8+H8SvYqP/JWIj4HTcGOhCRY5gPbFXzmx712k+TbDr0ywuKm+ScChBO1FXHLccOHJqVoSGI9usvs4G9r4UQLbyiWlcG4LPAR2ur0jKQPKBuJN8sG+G2zHj4yDWws6bsroFK2kaozO2yOTQhX9eVHFu4U8CZerPXs+2PMwo5KMIUnCw+f0z1jnY/az4hNMLs7FaY+c/VljoWPw1E1NcZpQN9skNn/3id7FmBz5FtxUhX0FRCKNSjWSGNGelJSrGgZ3EJ2jEAsOkVJqRqcgkcIbzbhrXM9CB+A6alunqmzWOpBh/IxjjdYBbi9ueSk+SxUs/hREaPw660WvaHgdKL6maVeJ1XYMizxhL60nYLL1YrPT7NUCMe5WSFx7PA9+qwyArZGXeFPja8MzRdKjeoqapsth3AiOqL5qXvxH+7xBD9WejkSP9KhHyFoqfQ7eTLIS8I6egWKe8rNQ/9/juzMWrZkzqphaz6/Gekj22yniUe3BXNkFt9gM5g="
  },
  "appt7": {
    "salt": "HInuzhXU20vO6CgjxPZvOg==",
    "iv": "ZF8thrjyLg9NU8nS",
    "data": "DuwlMAquCZ7hAAZlc9JqDlgUt8c/gt4JK9ogvvE5HNIWTpTgWFVkWXp9UXQXSKy3ilsl3ccdFWHp68imQnKHO4mBi0cUDkAUlYfmaIdZEYPFPvLpUdjsVcUh5mXbLVYwNfHoCRM5csghuhIKPkJ5+J6KPww/HU3D+HWBi0L1qZT6W7CPdpNQtER4eoh1aCIUP+RbpkZHEFY48rUHTXsIb99ap2O7WWTjLKb4ijrkxIFMF7pcToXXHSIEghea9AeQLj74avmXVXxbNBWhA1eC0Sk6SXa+t3k4Iep4mI889Z5eBlyw8jhGYAAh0ZxSxKFfGZfNUUgxyu2q36Y+KE3apHcGiXvKGa0/+xzbyoH2Kwcz44LYIBIlDXeaTY1dvMbrBbgdLvL2g/LrWTUR/CC8vO6/uRrLDn3AaJDRkaUooO2aFX2eQYCiokZVvk+Q3ngb9SQIbFfFByObRL7Vt9ZlR0h49yY2B6o12qz1FiBTPnf1bcgJDzPnX0Z1fEFFqBEqRRR8ZZrXs6wVaw4uYaRzYSHc4p45kNbcffteOC5QFthkibkQE3KpiQsfl6b1YC2TaFbrnx6dm7iCGxK79U+ocKFkPrHyO0teWKlEKz9fP5BZg9DwRLP5iQf/HmaZR5pX+OvpXBWbE/vnW0VsD0oHSPinua4WqvRwokJdl+Jn/U4GWaoF9UK9fFpaZZxmvweNkCBEbKv813swBOo63f1TH+4cf1mpGcPabVWwVDi7Jgt6ZKkYFee0H71rpjpq2QVrATh6yA8lVGerpCGp8F/uhFAlS5iRpFb7x52prWaokfI78TTxw9/9ovPTGrQrVmsf8jMW50E2kvjw6B+zaXx9O/Pwlp/dThxObDY1r4YvSNn/SfVkEInfVt/wq8I3Tsmna7D2DiX6Ks09KBNPwG+oTbTxtPqlhcn90WT/PUSXHPMswQ4xpuSydbQrv37l87RRnJv9Yg2Wh6fnYW9aAMUNT+MHp6uGlH7mtCAL63ce2SzGiMpmugRvy17fhdjPo3HTFKSeFHhhhsWl3v/ekg7vjQDT41oOiuU0x66tI4edi6X+CGBD0An8CtDYOKuRCC2Xe2gZolCsGXbEyi84sSqoAUb2RGvHfFHNZZLfWU9dSRbsUBcD2o513y3SAJTtkENppvF2WaaQQ7j5kgCPz1FJrNwzER+ilkRP8UN2TsQEwhBWJWaxACcaHMergeC2S5iQEXRSql01IRlpoRWFOxyPxp5Vr9RRXscyI1lskswv6VLHwJ0nqUrqBC22MBrdqXvlFbCRUScsDBjWT41n6xxRU2SuNpoSwBZZ3ctZNqroGB038TPnsNQu5zRCeBpfZSZ0DnMOvDPHJPHEbMAaq+B06H69uGCrykAFCotuvb8qUunB/bRWsYm/sWFKe3zLNH1l5GfupT4Q+MgdrxdF/8hLuWvy9j1Ucsup8Y7cSa7C3E3Tu8psWOUEcuLnrBT6K3rzMyZMi4JdfqAMltNk6arGL1JIdcBVhNPC9/OuYG7kYbUTNaepU/noguGelNE6m7PgdLWxhQUF9CfpKBXEy+bQyoTPoCdNlg3Daju64cVwygiowV4n3BFNQ2poR0GyXi5n/4B6fCi4aMUkOLLYJkpmdIqukUYUPQNifV62KrnMAQE45U7rfQWePKwPJbmdWLZVx2v5taoiTpenmKc6RELBdCXDflQHTNjHeHC40o+iWHgPMS8M8y0E4ht1G+Fpk8kBO3E5W6OMJ9L1hxt3dVDFxMrRwvkWFsUzE+Ew5V7PKJKfKTi3HL0w5p8tw94WD8gGpnmaVKcyE6sGelKTb2ffXRXYxM2p9eTPGVyWDXXbO3OzvnsYIXxJbaUovy1wa42cdivPdAgI7w1GyCsB1Qe6CSztGtOoShIcxsHT3jQdQW/Ya2QMiy0/36J8JCNzIvIrAQFmrMcao76WMsAIPJx68rpOdosI"
  },
  "appt8": {
    "salt": "xvoVEi2Hv0dHI+S+f+lLEg==",
    "iv": "x7Yv8ICpyIhq5nv0",
    "data": "cfKFY62tKzMg5qFr5P5ZpImg5CfJjCCVKK/7H8E+k6hx9Lr3KHf+Xj+Im5qKIUepsFX2OT1xg5+vrAtfPjG7Caf7C8YOFggct3DWK2hOyFord7WJ2XXC9BEF4StprzCZw1XJAkyFlyqorxq98y4h5f220kvNtlLf7dxgb7eFNgwN7mD2Xuu0SVli34pZpBAxQrNvfXl5l2azVjfdAb4JGdjfZz02LgW4i8WKu6GJ93g+hDPUO8BxrOtZVAXOwPjq3EFCmurhMCI4vZwKEUVrRebjC/vklPBUtaBVNvsivIKq4mU6V2fiubD0jCtsWOx7Wm7hPp6lshE7FyvR+TVfD71RYoMjZedGFxneJsWA82wjTWDpZAL+BCL/i4RZ8ILmIwvyRpSXODIXfv8ip+F2wy/hzG4ZrP9nzFv95BL8yTImSr1ErTBie+hka60B/OIrzCynaVqQ/LBqU5oAY2b91BOlvcVc544PPkRCgGJqa5l9Dwgb5gVf54EVm227BzCPRB8UPQLXKLgs6ZWVfwdiFXOwI/sCsRr9GOkBjanH4014JOFaASlZeazu8Mjq5dn75JWpEnb9jYU7W/oHHOiNzB4tkpmI9PpFtxOQPaJHxJR6DL7ZytyWsdBkqq//qk+CsFWEimrwcCucQ+pxL7ViPGwNcYxTCykVO8hMOYikJaR4byazLp4NCFt5+b5edwemJ0DJdSJdY6XqOfzY6GY+s6MxW0bYu0BI8UYI6h0DoPUxWMD4cYVIhBJ/S8VdaUfbFjSTBq501htiFZiT1eLoJb5TFgtFMaqpLMayHyrQq3dhNt4iwcAXGJITrKDOq9h9ancQD3lv+r2GQWkEMVR4gcuEPE9lv9utLLc5x/NKx5G2g9PLlpB0zuA57pVSQ6vxMsjqyKlBt/SZc36jJisKYP7ZY0yfIZQGN/5+voUt/XEXMmIv9YbAPhxIJLutYcp3OOY43xpOtdxlCDlRAp+oFebIJFSztvDOApr29LCz96KkvMxopF8AGhxMEPCEygMKUyii2ICnASuSS6EKCc3XS1Whqj354ynenDDlegTMsGmKkgdDVRB/sxTPvybsiJxiPU9iIqN40M8ofPqSDTK5Xm6TpQMqID4Hi3EH/J++KyZK7DHZ1mRqtjC6XHMDvgXvDmI2ZFqlVhGOttGGt90LI9JN/5dCsWh2ET/zyyWg8iHTADuBAQyPUcYs2OcRAI0Sr4wSqH0j3b9LsMZbZYZYhYYdr/pShUAD6ltVtxs+peYGVqsIXw=="
  },
  "admin": {
    "salt": "y2QL2zXvCNOkVFeQ+J9yhA==",
    "iv": "U+xq+x7cxSISqtMa",
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
