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
    "salt": "yFyppzhq+pbuX7H5bu6arQ==",
    "iv": "LlhLs/SjLQpOAi/7",
    "data": "GoYkVNWw32X65ym83WqU6K+eiyscjlVoDGTGjkzMgjpQ7mDcQ4eNuHXcM2y/wQ6tT0zkoN1MavhcBalh/U2SPcrDPr307jOxr5x1DkCL1RXZiYC6gQ5Xj1fjS7oKgY72eA4yzrx7lxz/0T2D0SsIcZXbH2MJbk+q4KaPynbIqZI2X1ljUki3mITbGh+TwUfQA/duLfGMtSQALT+/I0NtPUeqxZIHqCL6pyZEFEURPTW+5WZqvrTjIZwm2JxKVS5lR1wqYX1gpNnTcpoOWAoGP+DDVU6g3WNwaOPk1L/es3Ces454DQBaZ78z3D55WgUisS4hXO96ujPqM0TObAdtDEbAOceGpIyk4Ev76fFsjwM8nrI3iuJ/T6haN4n5npU0R5oFYRKV4zp0qgWUVc9J4HiCuOJAAjMS/mpQHZepHQiuRMF17P52RkJ+NsTZ9jHZqbG4yFpH1KfhrMzygAQwAJAhuGhnfy3449cw4nhJyPTPf2LtHWJQInLlPd2uA1ZllP1P7KBQVMD8rhJV/oO6JncZyZQ59wLjGp0I3juUAOOlwBkdhu34gH8RFL0rdI/bXZK7gKd95keMoqWlLjnX5SljGdZnN7qd0xoEla7pf0An92dzgBxZ0IPywVif+jJmw6W6jtEBZMT7Ir0S5FwUXY+M9FzWv0a2Qw0dctOKFKtGfceM3HHFIzn4K8VvgYynU2SiaenBxG2X4JwqGxx1Fos2bDiUvzckfMyLw1aBKabXxHpZNS34o22VIrIvow6XebXTVn8OkYClNfg2JsXPsQLL7Y9dYHaKLraz4+riWyY7KqCcTuGijO+Az9Q+tqiWWistDJ6RoYmN9ZnQKum2wSmtzQE8pnpjxD974CWtbVJrlxSidgyH7RcvH37N6R/tplvAi5RINZh7Bs2Xjmk6Xsc/JvB2Rrn+DBUtCANiQj5LfmtMzApZxwzyrDO5V5v1b318Fn/X4sDxVwjXX6f3qzBExKZEEPRDCIi3SjHeGdLnUuLe0XOm0uH0p5AUIcv7WWNSsIwtAi3oBtHgpX2w+xWWjPNw3+PJjcP3lb2yNEwwpfDmP9LIqb7yIxzWoabL1yiyEY1akbVBNrQ0PraCKXmt7K1NRMECbOtHr06b8urFoqX34JZvrFPevs2cxYx6FC1o6vnRlbGi7QT99ioIL1E/m0c994BKmZRCSHcxfSKs40wUecib6NiiDU9PifBr8gh/aDwktD06iS/5o6EC4Fi4IbFtexX2L4EC1lKj8ext+M49cWLRaYnoGKgZHeTNj6jNV7eBDWYJ+RGc4CBBAbNVNos0MqpcBgHHYMTZ5fp0aLZFrIWffaMI6ByOZeXOK/z7X5wAUlnF0EVqDVUKgP6bpi1RwbHMFDCwuzHsjtsYT+DNghLW0B1eDzt/V7VpKM+EWnYc7lt6Sz7EpKZlqi/Kg98xu7wMKRiGxYTHnUz6WDe6772Hr32oBG/Va48SgmixRYTDUJ+RSVtbQQg3xez7tezoYligUBQPVJMXoDuAmxyiWVMaAlBLKs88v5vLxjtr/vlTOqbx1AlOG9Z1pqb7IEMUUQaWQsW8xE7cxmXQvD4BI6AcNVk0i6xuhIwEHVzg8ALToiffM38gZEI3p9CPt80LlV8ataijlrhDzHJPifWyxKEL5msvuEpbyWGqToCL/3FbxxfrAJTdatoj/O2jwccP2UBGTiYR4+CV20aZ2fZJHe6e4nQGCboaMrPvsapBH5PKlX/WVgW0ElxbLyIyInifhaEZlWptwzx72nDALWpJhnMifofmJoDC940esyXus58nquChdIiEYYuGXJ0i484Q9DNb23QSHvUIw1X8xvzPhi/6s96lGjxlCs/nm9g0KGqKgmOC9hyAPUAQ/E+5Sz1/ibVq52I8p31QkdenG6zy3c4WewNj0uwr1nEYPis7F+5IpCkPorRvqorJXM4/KJEcWKub2ukl/xcHFMEAriJIQ7KglWxlYdcpO09IsODG/WqbnhmcTwtcD1DgAaOWSprWQ9we0fvw2phEZ96AQ+JuhRV+iVpr7k+84erwbHrZ9gSo0Z5UFjMPbKClqDHJI7eEPugEQk8a6zGYvNVmCeFpjD7Ch8JcRMsZtg/xwWHGBSqmKy6hNjWs29IGncACXYWWcjpKY0ej4/kt5OrAgiEmhQH4yoURCsUAe2Twjaxz7WJ/AXbAXIu9ifa8HwB2HphvjlrTh9ftNfqfRMXz/C7hzRvgcdQ9diMsOqYR02uImXc/9q4vA1MzGbkoSzjYXy4EVAkg5iGcfQHh0NIUNKLBUviwyT+O423ZZKQFjB0GTJhCO8ADVVcIS9aaxtpql9r5+ceeBFGimsIYNUTdbAoEMilV5QI6kTAmy80NbopKQTkoqLaa1XEMzlN81WUvWIg5XM3LjeyMaSuch0f8wjd+dGPG6P1vc/e3yoGwZcWIi2InvMF8XWSDufaF+mGXf7ScfIh/cw=="
  },
  "nguyen": {
    "salt": "a/T1p3H51O80C7XNwDvhXQ==",
    "iv": "AXO4pco/XT6zrHDL",
    "data": "dNwbByPpH1NBOYNnip1GvEaS1H8K+zCsqar/qDq7ubpB7htJszPn2GFPi9Zi72roPDkGUwdV0DIsHV4j8NyoBZDFs3nG7ar/wSgnTEnSzq30HZmPQqEkQvtu9or5e4xpKPqfPkOHEwQJZ7QaP1MnhbbFNnlcQkJzEakMoYvWl2Msq8txcC+aGqmLTm0qlcD5HWtYTe6TVzQeODi7V4AtsFaB3nTvScGNDtw4Q32ggsGDqu9rmfxfwMk4XJWSksBpo9ZVxRPuRqiUvUBdoC4Fnc2nA/ZYahiXLpFRI4bzogdzuAMSlvs5uD9MGczDnzlTAYVgDnpfZ3DwYPVHoCBxIQEY76pHba4f8H0McGtEOV+fZjdkEdudtpqwD1q9P5zwjz75ijVYtXcv8CP8U+NHXSdRPFDNxfiwVnCcAWBDB/7c5QW2Zst4iacLixFOR4LsvF/nEPGrOk3fZA2Ydm/pNQWxO+rGDiRWASBb4VgpNb9HnA1mnukGGrRd/UhJ9tuheQbG2xnqrzmdOjhTy2TPazoCHsQqTnNxfmPKWNtVcYj4YH99o4FZvxzkBtqcctces1Fhrju7W8v8UJJmupuXn9ClOPiuTrAa3yjxR39LQqWcA165/txZld+ejIQx8CJBiWYnQumwkvvQJyiJwklbuo/zECODTm2q8f+30yjfUaHwnUvFdDZFKJ0mR+gy5VJnyQ/TGVptvC3gNVajJevgqOmXBfdlMIz2ODYDf7VVclJkTTIx4h2iY5ZPwMUDs4/jtHinAJvMn0UjRa90qQzmEL7mS8P+HpjQWEru0w1BqbNlvA9/eKVDycacM5zQfYLIhhlLlkUN7ZuowtGIcgSlKDXR0zx+YMgEpXj0j02hC/nZt95JrW66YvsuYgAKbrohx3P4gtvqHp+spl8AuouxlGth4O/oPXh0JdUcaNDs+LKYox1qIW5g6/XWPkTO4dHF3zfYJyC1VE/74YPs3Jg5oI10l55JWB+z+Nz+8JbwMqQScBwtbsY7E866eB4dVPHqcmKzqcxKXR71iZ4C9kRUcimEX5geAPq84R/C+mEjGiVl4z+8I0jKpTUY/uqx3EtZM082OM/JyaKhOW69qIYo43MvCSuboq4t5l5FbOgfU2bZP/YWgLrSZu7C1Cr0jaZ2MI9rFgUYby6MU0psWKucIo921vcnMayy5XKiMjIYyGxbyom2wA5j3eUA4c4dQ8oYKGkLEtwiTSneR+3AP4kZVzHnECNBtMtJgXErNOyLkPfwsFrsmIMC6lrwh07VLk0SY/opqIyyX3CTSemfBxK7pvNDMFPCAti3JYscozqLuDHlypFFvNrl1qKvf9ILqsK9z21xeD+YxwF64GJPDFA3N3C7wNqeQ1el8ITW0jzvAwTH+8UNKddvnuNHTi/8gY0crtr7J8x1rhLwLCJU03bCYpn7zHFFYA5pWSHbeqrhR01sfu2EbgBGWYE2OVwUHEr8tRQ2JBOLOYR427+7e1/T5T+/uGgOXws7KNyNfXtzplPVPTpqzglsPFBvw8CHCaQUlz+7Jxnzs/Dk9B+aswbL72tLWp+RTLDkVASer2vAd0k1dzc9ZZ8tlebUaFDSg/qbRvzI1LQRgutVS/M="
  },
  "dupont": {
    "salt": "Zg7cSjILF0s5LAKTh0CWiw==",
    "iv": "/i/8/mEetMFRYuDq",
    "data": "7mNPxcvjSe4Spa10eUXy8zsZQ2QbdlfLMnczQzvm2dwMkqcw/otbiNfn/o6zdUG6zZH5NqrIIqRK/iaaUAnnnEx+WAwy9CsI8LvUisZjmqwU6f3iemBv5qTeNXwR44xQt5+VypS3P40jSii6BG0RkjzIitHomKchNVOTJdRjooNfK5a2HrX7/P4JyhLbdsefTVWahpdNrDl8qib1RGwf3ROUCxYQFM5QWHp9EL4q/tiLRTYR7/u1dU6psLdzzjImfWU+oa9as5fHFWNt939XOAMyCMwGFHOO/mK/LcHEBk6l7ZbhoLHuT+Q2w1XPBZHQHY6zHTRjmnhcw+nc6NblBINfxpzVwv/Z4Oy6ieB763T1cbt4h0uXzSfNl/kwwbJgHwWgEITmb0Wgmx6yLeeUxxTgzYnDUjr1/UgNc+Vombvcr8T3bMnDNhg7B5lJR1sMFbE1RToM788WDXQcQN8YvpcrNhXlrN9vhzgw5VbtfIqSuPIPPKAJs/kMt8X2e/y/JyQL7mnWefNvDqo25BMD4D0AsN4DzCSdsoTSwB5xZZYr7TwF77S+ncgHPjPbAniu24ECe/8syUNrZYnzjpQd1K4G/dQ8ToA44tKGXIURQI6FLGZLyr6SLVnEvyG9t0UcVUxddtM4Jif4LrFDMSPsX/HGXpO8k0uMkzWC/nLSa0hUbqA+XH6zAk6y7BhWHDvXrxDfJENCVObU9sl5i2O9udAqGSe/2OnxsMXHi3c3PBjNUup63OBi9kcX4xA5bp2vlLdrwGmN1ZZ8M8ne2yCq0/kOccfpN+wwY++yGR7umSQRXiJQyKfONPzzPP5LysiftZfrAtV5HSRoh6m7cjDWoockznkBRhgySmYhhkdILf16JShGRsxGgE/HyWV8sS7MUt1GPJOTbrc0LMXXxYgulObuy8F5v/pOX52L1GOcEP72o+SbDDgI0rIALeXqy0GyPrnith2uokTR4VbROaSNg0JuP2SZ04N3i9sLD/TxJ+sMbjmUtAukT/KoFLZvIc2zkjFBFVJQkcNXCX+HHWLhiS3RiV3hRGHy9iTzLlI5+++GOI9U6BIu0hze+d6nm4RhNNOEmS5mhHN8f8NwLMcuoUKUI8/Qrc19/EiYFzJsLyoj+JlhLnIZiMQ3BdrPReEhfQf2xrnAkbGwRNucq16JrxuW42AeZz1PaJWjCqLLFV6+Q/3/sVyuKUxrQosnOhjM9CHfnWHeUOBh/1vKxtck6FTJPGTfkSJYCjQUUY5S5Lac7UhF6C/jnQyL15yMJzvMdj0gdMxtSaks5NpgwWYCuKAAJEN0HMb+K4FcjEcmIYpWcFCHqKHHfRwsYW1He5EKppqPR3vQ7/Q1LySjLHRFDB5613vlVKG5aBu7U0YjRVOdqjBHXfufXb3CVsfM2TCHBFD+t08Dn2PgejMuq1VtUgBROgizgS5irOlH3xh7CnNqyMEPGz5vRlClfrocs0C9lEsDU/khRS3hEi629P9yjSppT6WzUGTAm4QbvlfGNH2F983Kf9xSbWHYcg=="
  },
  "rousseau": {
    "salt": "UrzaXi+tRdp39i+w7A3CvA==",
    "iv": "4Sekezv/dzowvSfS",
    "data": "sH6zwC3YRkOhJbJpd8RnoD0JJAT7cIcLaYTnQlF4AW+1Nks6XLN01BYXn/bxsjPrC2TcL1/vRq6+6s1k+YIEabZ5TJ85ywqxSzqBLgEE0LRMCtLuWJlRSk4S2WY3IG81zsKGeQO8E/zNHpSZ2/thz38Z8ZWwZ09AKHKa/zRqIqHxu9hr5OtjatpJdkD6ANb1kqCT8XdaQTsF9zVIQ1BfKxsFjQPCel+wBtJy/gk/0XWJ8HlVZSREj/CpBWMUhBgQZ26SEtf5dPkqpzM1CPTG8vwzPXrIy3LacTWmnX3K+bcYDvyMR2aQPSUH8IKJ89DSXHJzkXnpQE22XnLm4myB3fLuQMNuckY/T6+uTU3cmNqaYZr/Yed9rYTXvRuZyMTHNQok+CRQOSnGmUbxg5KAmwxbjpV3cQYRi7K/oBLahGrdUuqGuRgdrzfLw51fpgkDG6O2G2HHPmT0/k5hslSyWbOgWnFtfvJj93xDfJHj1lGJAzfRLzaDBv5bUO1+sHhgj6+P27i/JzwBUSVgGD29PXBq0aSIt//iq2zsF+PMZe7o+vCRCYUMLteBLqCSPTGtPYuAh/RRY8hbuz0lPyoJvDCdYSpPI3xmhFGMNIwQCKfJqCLfkxMwp3/urv1a1b/pPtl7OWJsZv0HIladWi0px2rSbpXOY9blcooJTA8u88YKV18t3zsYlm5w1qPDo3SnuqiXXVYJN2ihrpDi7jU3MjTYHNBf7C0fDw8AA/9q66LuWkCd4HHdGxW3G8F+Nm3mgf8tXI2BU42T4a+Li8+MFcmqd6CUImzqf5x2gOK6Gyr5WhK8Duny7a1mURoWq/U6O9qdbkiuF0Pq4Hu5VhF2A2w9N1LEmwVfl6VlbcsqB9Uc6hDUxGy5eq+/3DRtGeSd3nkmPlixw80V7fd9UMnqRBdI+lEDGmkvQ7yMVDrN/n5zUzdscCivAW4irR7yMcdk+Txh/MlJ7bR5IQXWHq/5gf4uPLPHcqz1rnv393/3do7Qa2aMirLaLBeRqKBeHonCwBRR2GAWY32g8kZONabTlgNuEMSqLi9B7ypQvNXFxOkqfFq0XrTBUw6Q5vEw/UouCy/9LCI5hLYt2mtStopUI312YKxcCa+qjr2NFuw+izusSctKyCYqPj8UEMMc9+RiEv3AH1klLOR4wEw/ahk54s0rOZ3+M5Zjx/yCP3KDBF1T+vSyIo+jDG2XN2QpJiv4q/D5o/NDVfKYM8t8BBT7mLctp0mxhr/Ebpqh//cWTgJdRJw9rrieoxA6rKIsWVW0FPFgzSlZwq44zDYWeDTrf0MIhJgOx3y/pc75XznWEewvhe0+znvtE7elrrjbZ/0/xgDnHJFZ0Xep44hkdVJnHRrZpgmddU/a1vYFriO2QhaQqJ8q8oEnjxRRLP0nMjkTaGQZu/AJuWUsqXDtccYlEZqYV7t0HFVSXgKaXOI+0m9dlaic92Cp90tFd8mf7QoDJcaxkd7BY87uNYe5SsYqFwAS83MK5WHvrHEsNgzez0Ftc7D8Mme0er7eJnJQf4cW7U9jBrCL13PcAMPkkGwqVUtVkRDV3abUCcuo4NJee3XGanK1AQz/EQoTC3hkgd4+4BvL+HGb/x/a7CqZ"
  },
  "bernard": {
    "salt": "O/PzUot6bqQsNa3Vw5eP0A==",
    "iv": "DLT14rkfH5Vp43Rb",
    "data": "sL0OOTP+1ykxqLZ/GUYzXf1V85nocHKVkbIzcaynJDsgZkDfH03Rfqt1L/ww8vzJnxPrzaKx/xhPkdLQx675ce/eTDUIj5LigrZ66dM7APkaXnGRlgWs7M/oTycufPBRCvNhIjcYhf9b+wQLebqMmsHQmk+eWG4bm4lWsLqF4b7YvXB0b2vxAgaZoXTKl9hbw+4SYL8INGZNmWa1QwFZohN+mTJ5R4QfOVWwTAbgkzNPoMJDWFj32QhJufFsMT/kJamo+R4SDtFi0v2p/vPAbPTgGst0zFvNhWG8KuGeiE7/VDxzwjTJeAdupzENHRJhFOW/kiTn4yPEKmyJZ5WGZ7tmoNZOVeXfeG9e/uAecCufJhd9fyGOJs/lhq1x9PBFSzAPOLL7OIEt9VzM6YasFnAQH1QKf35ml7LXD1Eur/bKtks9xHBMm9pI7BKU1Xx2FJSqBicIwbnuPy4vYek8tpPdPdsTIClb+RE3S4iALeY6I/ck5tT0lN2D52IGbRXsRz/448PhmhUhtORYRbPAzuRu9kxNB7mOKDvA3zg4/QduPYgLmnvZRtYid9c/2D1PIFy94FdjcXhFllLGqGHZFVNkjXABdYSM+yT7tsJfcxz5ya8s81UOJe9ijDLAoBSAsUyHSEAbEDiNH/nxkp30LyM/9K83SUTrZv7XZMmpXkXbkoiPYDIXTF72/+f66kaPQm/CR8V/4SrITFcJKsN1RHeISYNxPAVBkz848ZrUjiMEu+oo23LgP6U9fbKnD0ezyzxm/rQMlMM2Fh8Ke+VwZBeFslXeixLggBWx2/0DxmiHQ6V2hiSVQNj5aVIAVwNn8d1xhQvaES34nsVXilQqPoLthjmYuMXKt1YJv6Mpc8pfjd0cAbCQSsuIOpo7RCD60TEC833DABunKrnK63wVdWyD+kUESvAcH3FT5hoQqxqxoPRAocryX//6T2YvHCexlNEpyBo7BbH3wYqZtTcyNOXGCCSHYH82d/YHSAiMSObDlorYsi1JyvYYMByx8sktOmj/aGPFbUw9Mu0Qilk8j5IPp4MGPoaz1MoXG785fyfkFwEKeaJp0voR9e1s4TMC68eEn/8gl8SeCHQCD9OYJ0bBoDgPGFQmMbrixmBL5QsW7fuEzf8epYyWURTWFZlghNn8wKru0quaDTV1lZ2dallJZWVMxNJ8hZs0gMQ2kAeYk7PC6wONgNWz6b0bDAuuw/7QJd+jhEsnD16Cs8Fziuk0ud3wxk9Fto6cctvlL6ieqAZqhW2/UDybugGIBK8lKE+GULP+j8JFKzGV37BWEaLTwCUCq1ef36lkJsYpSOJtmzga8aFcSTyeKvmdqHhTWNpMQJsLMPNURJzITrqwh2YfWFP+4ArZO1H962o1JECum69t3X+h+ZVYPktnItILRFHQpTob9BMFGiyKpwR9J/8W3tXa7fRHTs6q42qilKqpqXzHpJjdX89BDBNjoxkwgHl60SV9zxg5+3PXOGw2z3LO8VrmE0tfZ1rgN7XYXifX0bdFlHsQ51fbeWdsb2eusp1Xl0Lcc8fpw7+oFShUN26dWdI9hH217afLr8lSXjhAttIx8truz+quoYJ24umE1WJUzeptN2bUHSz8GD21UuGisT5mn4nxSrXK03fMu75je+bEE0uWiQzwlR3ZrDSr1vaf8jXs7GRdnxcnHTAf9Soh5TTz2PHJINp4oMfggUwNyz5oRDv9X75Eg2lPwszWSSdlg+9aNiikuhuE9cpqyn9b3Rje8mKplBcsPjXvKKxWKx7zf5gv3kbmsguB93/5l8JkS/9XFW4txqqQW+0C+lNCRMeOOtNgHlL4tavYXVhf/kpLErgtG1710jRNyO1OfhWOXvb7OTUwQt3mohLI3ENLoZYxHPh2wmgoNSBNSNg52dEu1AIsqaJ6roh03Pe/sbmDYaHBKuU+ugcZX4hOEw8IazGeCfXMDBM5QlImYUwIAU38kYhDKoWf9ph4lz0C+INB5GsiOaw="
  },
  "lefevre": {
    "salt": "8e1SpFWtdDed5PWNvsY4LQ==",
    "iv": "iPRi/so0t5CZnEaN",
    "data": "FT24A3JbJ1y4e+7OlO9zQ1uKJH5uBxMc2UlORSlvOQ5zhYI/5LGRCid75dklA+3N9Q8bHUhajXFCvGSJH3FXMex4TQrOCJNZt67NfOgoNTnf6+CsS3Axrl8QQtsYnD4acgEDhJc4Odiy36rBe3LeevJAYrUrCH117BdFa4Wswr0OhQCjopNl9zQGSyzHnzqCALvB0HTQwwHHshPjFGk0IoHVqNfrk3wlJ20T6KUD46kqcBW7Y5Sq7Ju7vT8HFV8Af0hCQvKIOOqIgcDHdN38/M7cPegFvmwUrytRS1S7m6qkVdK4r3D7k9ZMN6w3xLp4y8/o862HrakuBYZAlh9dWeKfdAAVY6aQVfpgyIksMKM7JdzJHlnzEbAzBgA2IwucvcTmO/wc78i/yNmAivWq0JwfmEtjN+NnFQvo45yp/ySPly1Kr2TdduknjyaH/UkSNVGlpbXVXxfAmamOrNyVDQ0CfSkKEam0+iWcPKvTzpHKmq/UebFxqNr/5Q7SOflTAuIuTVWRHOIqVvyeCLzzLYZxuJswt6N+i/iAqB+RvAv3hIZegtEIeT9x7bzoopfgbW9OIpVFZLbINKTxF7yvmjzf5zlN/+KTaDxrU4DnnmjY57yqn72wkIXCueqhvVfeeZ1WREqwk6MmFyv0Ja3dH7DaxOKBoGw4L63tdy8+DYYzq+6QqIh/PEZstizlTHuFy2W4QlmVE5sJcqTiZgpH7QVduoANV9D2gbJ8IdqgnBGpIG3wocOsgeFxMzDnpW5a9E+2+TrTRHyW9kIlvCWrHJI97UWEfr2KN8seFoXO23nNQKsxIcetpnoMzg+wKrIUHAkv8EeHqWk90Eho/K6KKq8CXEcjW9r88cKCtTU0Pu2Y4R+rpaKIbjfqVBmyUfe+YbHepT6GoEUDWSNKGP0U350NOOSUTUREY/9hyoaYLWvvxLbUq8x2K/uFZ7+kXcqpumlzJcg3L02SEg/73yOmf3AZG5yBSrlIpsl6L7/yDYx8fAdo+KeHNq/HUviK5SqJ2KCGDrQt4Trn4OzoH8LGRLMxoM9LkvJcF0WXEPkhKbGFvFVo4G7VVK2ygj9OXzVh7EqfLr6By/S5LxgKoVFYx9ALaTqPh7pifm3HAoAjhhSvFyQ3E18OQxlIkcbpRJzEl4587LbRxDVdJ2wxY1FElD+I6MxW4TcStLXACvforbEUk469u/1XPawi9aMhFK9z97hrxnWQk2G1ZaWwR/XhW1Esf2Wyk25Drincoo6nuLLTc5hRBITe83mr3g6oaEHhEdbIaBN4AdNcAbtJAFNPdzGpaoBYUyufvBDYs4OILO6SrSv8gvOFoXxLMAniSiAG4d/RYd6t1B3jK91x78k86ejXNkOFzh/Em96Vdj7DOib7v5QKFEIxFhbt3GHIATiaA43uNa8juL2rjRcrjHWlvf4E5MZjLUcKxfop4ZvyVyXFQeZU4LJGfuiHXt08qAnE+QMM+q8nivwMDw70AF9j0wHUXX25fZHv2yDt9NS8XFLM+R0/8ws53a4djYPC+eyAFoS4KmAOx0bZ6E029W59O6jnpYdug8DZHGQcCGvBYZwflnTUM863TSknQbpaYlbaRIM/Zxvn2lBkJf/JcEHByLDQaoJcpWMBl6/YD09bEF7+L4Dn5Wke9fYgFVyW/Un9whLRAmUghxsHL2qmIGcIB9u4TFHluq/Ty7/ns3iOcYvQuFQkDKLM9TVW91h6D1RerpI6fNyOf8pbWlkHNlBiLWWG707YfIpWhX7EppdJ6/nuIzg1X2+Bc+p5vLNDH5OIbNgNpM4r8gfJh6iOM8FpzDtY/E9PQ9OMvoLuhGCm/z1PeiVKhAbiMToMnMFJtrIt9oqAF1dib0mhXA/WIx4fpY03Jh3pQNMyyqqTmgxalh4EMkE="
  },
  "garnier": {
    "salt": "GMIYt2yB8uaTzs4zbfLZgQ==",
    "iv": "NZYG6mhykGzPQmXr",
    "data": "nDEzJv4NPb0Wq2xOXWLYXS8LOAI9cT9191gMYkuUYwUdptvQnrEgUykeueRDziZpXpeaPymfQ1tCNn4olsstmgoVOJPlPM05+2dNV9eThWlylngUV88E3s1BBo3aIW+NUloOhX1uosPvAvIWr4PEonRwSjsFHa8T9pOSZjvXR8qtLg9K4Nv07JRu6Ocu57cmYE5HBC5wZomZOs4Jub43Ut0F8hGsygD2aQTNPnbNfGoj7UddLnJVpez4sk0WRqQQbzHsQoEFRWVq6SE8HDXIzcnWnVaK/MFRYTc7gpc3d4+fIRqBcwmeKVBMXp+IvWSBC9B8mYfgaNdUZSodJNovdwh0HvtNmrU6EsI6ZevTdWWXcJTPhYlihlOIvw4TVhEzfDzv1qjftX2XU5GzuuxpZjAyLUWg4eR+cEMAhIn9ye/bwNz54y3i8Q2qirYx6r/SEfvNhW4KzcSyxZS70LUNd2M4IX0n+poLmhkgRdXIr1vGbuf1pFW3OJ+MHvpLNWbhz6cIbVnG9NawDLz1/6ou2YujQRJohx2M9nyTOkppn2OESORaGSjE++E/wWvFRrcdu0ypmWcc9CuWNZcuLBhiiwQsr/6XBkxCDos4nuhP39oscuXQAl5dkgK8Wd8OtvCnIFo1X7QtaUFKf69MuIPCG+7ELY1lmoiaRpvCzCXhPpOJ0ZzB2xNy0f6tyo6cnPAbz7sMc39Y83d1PiofM9kGsxM3bI9dZoFpzr+ioFoTcikza3Xk3sakZr9odNpicRB27c2xNaUvFrvRjtYoalhokrdVyzzaSgOhWW/OPRWT1qnoEEdv+Jgnmg6fr+sclTVvtXa+6WmPlXPOIoziSpUo96xFDKl77m3HfU8zf3r/Wta7YOouxcSIUl7d0remOwOTikCGWY00xzuQ5xbaEpAVWceHPnxrPOLrJbPe8yYcg8VHRBBhCUzBVK4pH2ggiERxLMrj2X0SJcWWY3jVf92MlwE5oDhGOBGRUIQxF1MKqSQ1StaGMpMJyeKUjcoumGcNKelW56Etmzzt9wO0VGZrr2uFGmVHDc2I6mlZG6EnZR01GHYETnUQSYsqCOdhzI0ID0UMgdz5gxQoyeqIH1vgQf1o+DYSuHHLPYbTRURBzgZGMPS7wDmhlzYIXKw6yETy+m8qAgvFGBgvw07ateZs74IyFWQpJviQY3xD3Fw4L+1tpyTwqY5kf69XumNhoqdZimjFIvfAdi2bNDc2NEiLsEK6JVIbce0gKdGFNtkacK0VSRwfVuoUjwxEk+/hxUUauOBSe5upjYzi8xsDO9mVL6VWDhYvz74rq358zE2K0pUJMS+YAPrShNnLhZkyeKT1Dm4IfeWcKRXA+YKDAPOBenKFd1jyrDUQgCgWuprCuqf9uXXiknCI+eZq1O539YNju/XZIQ9UWNM7WSVUWoqvjS3Epvsea+qRDwTwl7IKA3FlhWGLVwPs/L6K4B4H+G2QZ0AhyROrU5Y7RJBC+Rlt2UhKZ5YUeSEc3nKtwT0bX2PdcBNJvoCUGko/sUG1UYGpNV7LA4BRoCvf+4v6CWHnIq7z2RfEDgW3bIu4Mq83ovz58lgqjAnuY81+USwfe1g4k9JnI5j+kwnU/2obYNl9003V/ikt1Cm5BOlzmltFx/ZbItuIsJuPSGNQE8ljuQomfldWQZwyfysfHiGs37rE2Gm41YIAEGqxA1NgogVepn9JViytjOgxFwMSXQhVfIvugU/vsO4cwUQENDArjOxN0OLyt6AkLSYKDcrxDgS2OBHOtKpYSBhIpUYiUAHouAT2WP39c+aaq2z8fU1GmVCX8/ka5fnh6XNhvq6Y6gA3kn4tD6BVPVEacq+YjdYT9NikvTQ23wsX0JNTWaQZi1W3+i26TeUwTKkTGjB02gf04pWWnNqeY6ZWa5csxVQFMj7ZYmQX1Sif2SBUF8RZudZqKuQ580Zj"
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
