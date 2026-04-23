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
    "salt": "LHPyLToGUSbsuho555Z7eQ==",
    "iv": "eh+P07VxdY64uO7Q",
    "data": "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"
  },
  "nguyen": {
    "salt": "IeVC2ra+vYmVhxbWlZWkUw==",
    "iv": "nb89hR8iJarfVEu0",
    "data": "ECghIIBlA9WptBjck7uvoFFIOEFaGSEeT5aMdMsSRnMlZhkVMkeZ21KLJGh1K4vzOkPtrFb9LWACxv62UIetlj5TwqPQtWEPJEawqA076169MmqGwoOWA94Sd9VmiuxOr0zwrPYPtD7VYxchrDq/f4JaAKTD+kvx7sMoSISM4OMvjkKyuXSyp3S3vMSCCz9xEet3WRp9V1FI1Ksh9WNmWjWZLax0Vl5V06MfUKuKVCfFjwVp+VjWxwwjtyyJY9rVy63aWN8ZDz/ZJvSv3cEnI3L+vIA6+lFcTkXkq3KUk8/cKvuHAP+N/n1+RyBO7yg9WJl1Rxzs2mZ9WPIIc+gzxOvZ6ovzM6hgu0v01fATh2FiZF6HAIhMW99SQo9+dGbUz52ITLE0X3Fd7ehXTs5SZG1Thpi+zFo1ZyIAgC1G8pFX4tSSkzB3DUM6yS5EjDSERgLWf1PXujRryqQ6F3//CY0XnVLDPK3qXIgZ+v1zUFXB6j2lNPGaC5qKNl8MMDraXbIi8YdaYinGHm2Hlu4mIux/SqfTAE/Lw3DR9xe5NTQIm/g8EX1Z3MoNFV2GhzZnerlF9k4b8njUj6fr+NyEykJVNlF5G4HY1EAw26JGcAB7DNFVBnvKs59rp5VKCVmvSq34BgaxP/rlzqahCo8mc/XVvxoj3hWUl/s/+Cy3LoGVh8QakPEK56yaSJAflQ+jM2tsZKLRIiR67Bohp2L12MhxB8e+hqjHLNKaafXNZYR5zW7hUI1uiPxSfmNRLrqNlgPiQ/J4quv+qGVUzOLnj50k6ylz9Z9Om9nwezndGdoRElC+vzd3lhGMy5icuZbcNj2+Pm6yy8Os00h+pac4PiPAqLeYUFLjT1si/2jDuIE5pAnOqykMaC0Syrnc/UG/8J1J06Q2C8zjK6loAS5kQ04FN2biGjALShZdNK5NBdbNekGUFT98bfM4SPKofl2sgcUWoydOyTMcGIu/uWmbpmhjoi63mQ4CBnz9cNUkIfog4QkvONg4l47ulaMbEG9/XeAP92eIp7QeEvqrgopjQVBDRwx2jODrgJ59EN6q9KJw7yGHW2GqdO89rmrKcipE2vFoSSt18c8EHcuINLcS6SQEnGD4KeTv70FKIH1R2OcodGQygqvs0fGfCVHV/X1DebGQg3RK6NkzWJn2bfTOGBJ0Bjvl/vT3qGWr6cdPgg1ybUW7Z7xKYCU3xNGWLlP+QWEHQ0Wybuu3vO6mcEC9esl/0W+v5YWCG7nIIwol9sjuN3+747WgAXVTutGJM/KQ7FB+k7/RjB1rqrIM8jRQ+S1n8gQLRJXZRrPu9GtYbUG88+fsvCq1L1HGqziLmzZgv4kcZrCEMLNozXVQy3BAFXJu9dEuY4BPsvbQ1ma3h6I30z+x0IhXf9MvbEbrOLxJznIYrUQnKiZ+lmcWUARVpS5duGlcRrp6ii8HtWfx5qWBtMGEIJwrc/CGMx6W0rfTjzO9BvZ7MZTpWzZ0opC+Y4H0S9gBDPQq9mJ9/xtHVHzAQPL33pl49Xisg7LO1AVwm0grh7wJTyizEuKPz4gnK8dCiMmsftxJNjLI6voNoEb5p/nd/gm3H4seDw7paBC7aN0cxQNGi1WZ4yE="
  },
  "dupont": {
    "salt": "nV0XXZRpuQKIFZnu4pPm1w==",
    "iv": "vKWtjPqyGnGeoo+U",
    "data": "A5Fa8oWk2a6SOYiL45X5UIKUMd2lP9xWvzcVFOuGvyw+izNRCVtdKCbYJdLF7CiA0I0Is0chX/7FDmx6+gJWOowOqBz7Eoqfi0WXrm+EFTHSsD+p8+J55al/0Yh0gAT1sbxOYos6qlwh4pjAejkgJd74HlHZ/X5bN5Jl8MeiNpxni4mjGSTjlMam5RDBmCkVJ2fyZJo7qZp/sIlfNnX+LGPkz7cr6IFVbSLHHuAPScb3j1aJwv0iTwMKs+QAy5Ra2d+pMJVvJc4ekI6ym/Wsvcv5vKN7o/25iqsCVRaf6hubsz+6AK9xUz7Wl7n50mWMQE0/j+o2ztkSqCQUChGMB5oDBGZIxVcat93WYMck3yMO96JaLw/PEe8krw6qWe4AGrO1lPvpOdiF+Mo7nkEoS+Ha2ir4ZlqnzHCzXgtH+Cqc4Zc5bfQzweya6W6222OHm1TrKAQXH5mb4BQXn7J+YdhNA/MnRrIwuJmcm7HEikGDkiO8ep5C3CNS+qMIpLW4r21wNgbdnO3Uk9R/xWOWnXgHAZZF5oirX32cvBTkB3hio50kMBUFN9jHITky/mcj9sTLEmwRadEECf5CbLv6CMk66CV62DKlh10GbKQSDcKyIjiFpVn3V0/A9hR5C8f19RyHnKbTykcdUOIGTnQHaqVXW4JspTgc/77sPuGfnLy4FAjXUwW+ovNNyh9mLNcoFNN2N4KHo++EYDEjdfg0dhE+29Xg53CqVTWCbt7xrpkPkckTnRu14B7E9V3tk5Qygwwif/Qt/9T43eGWmMpq4eWVJR4ett+Duq3oYJGaGt+bhU5wXBGUIatVlM1T6KI9IT60kIVOrjY+Q7MbnTJJQl0w7XGB8GthjOaHaZEeG9d9ULwKeOW7nRDo3/0UCNec1ZTPN0rKwy5R3/wKf7mCDXtAWBHF99oacX9YQKISw1pQXFJVELZIAFzjRgp+toivI3Njo9LEc15TNvI9gHFWwwrsxzS7LppIZ4gtuF+kf9xLJeDPd1CTWWRedwWDm2FtCTTa+aP5Wrk0YQRQRhCW0Fmo1PlPsE+qzhrCPJ2Y4drTC9i/7xBUnEuD/L1E0QN9H/TbJ6xgqeOLj/VlvPAalsXDroCYZLlbO3pxsH///J1k0lxG7/vtVPkSXqGtXTrOaZxohzL0EJ6osMCwu1Vjyq2p+plD4R7RZb5aAXyd1R9yx3k9aZozBsrLgOLaHW96gQUTRL/XnyTTOj2WR1Ufr54InyfEedhZT4TISapy2AURSgsryRfKlAFXVcVUSYUM6YgXOZ3MIwewYh1GNsL7MvgfWJnWGN5NAymBTXn48y3QT5/PmX4hfKkkJ2TuznL0bwUe/bLfL9bZZlbf0QQ9SUfrbRQa46YEZ2wisd7qQb8o96Ov9L0YLUl8K2WXqKu91yjLqtO6P/N+Qc8DZyrenXeywLJcfLP5ujexRu6Z2tM3QZwHazwAPOG8V7MyRgzLNhwyQKeJFPAX9jtYKm68c3OlnpSPNv5CaSRA+lq0Po99S/ii0azYbkH1qQ=="
  },
  "rousseau": {
    "salt": "pjNDTH6s0e+YRc0B+9thXA==",
    "iv": "V4Sr9E8kO/44tqFI",
    "data": "+mzaOdLXUjW3LZe7qGRW+0lJGxsB4Iib/6ggoM8bSYgLG1WuFvugC5wf/aESTu9vUB9AIyxH4hX56ccXdgNSURNnxWjEJd8hZlvHfxQQbnQ75FAf7fjWO78d5nGu86HSdfwvAPJMoE9rBUUQ/7xNBFo3blgRnGJVH+1t3dz84ASDLqzY8JIq/gXJCEPgdv8+cY88krv8ps8xpAcIDcq+FcN+koawu8nqC0Ov88FqMtKynKdtARsgOD4uTsd6Yf1dSI0b7ruwDJohuzU6TP06tH/i7xoNerbS/pmK2TKZW58V9NsJYzImBVw4Qwyj9rbmfKdBk5cm/PA1FAWlqcUEJY6FRz7ukzqo9+TEHL9zwo3vEFqTu1f2fOE3H2hCGhXlImoO4QVXG6d4jIEaaXRm8mKY7SB8ancQiEhDoiW9FZo/8kjTlo1rFLkBr5Rz+jK577vOJ3bnRNcMXovpb7Q8y2E1Mbrcfj1duLpH97n9qlugeu2R+m+K9aDSBvP617rhcThtRkqTQSocj6ZxdSCa8nc6ct+zbzCpa6arwfxA4u6tO09E6wLKn6aGKkY/wHHQhIlB8vsqpd4FVykrDucFRWeAGsT+fMjcjzRYljYvtVAOTVuWb4MP4RiD10V4cXLF2lBpOJDLPt0PoHAF35crHqTYZ99TjvAGK+ZeyFvqvmjCQkrhLcVQkMj8ZmBg+7BS1iH/BcNXX2otLH1EJyzxCSDEMSl8Jr+z61PTJAA2zs22Lon0kD6GmRCDdQYSqJWr08+sdJvpUbs5VyYbck79DKb29rpXxRwMLGFN86IgfnnuB+H3IYBJlyK91X4q1HST3b/vZbSa4qRRMjojgJ7hveLp1O0yzWfKu40y1P+ZOPGb1t3ztNGauAQXp7YD0aKAepNCZ7/9Ut70TyURJtVcTIAPitD/+UjXcEhZ7CAHh1Jsg0nO5cWDhrW0i0rTYfN2/D/FUvnePyqzOrvlk/0PpHpRXgvrlIA1TgIxyg9xfdJAprjJdI558eJ/umKivmKLnjdGP0ooSuaqumwey2wcqYKXeTIFBCqB0StFhqc6DCkgMmJKks3JT6vI6DfLaWNGnz/O2kEfscw3RBhQW+xw5q+AUl9Ta/NInNWxTnrWqDc9HXyRsMJALwtHhVAUGHpQ3kV2E1A9Mn+5AeZeSB6vznbP3D7BH2EZ5ivpY51ii3KBssUdBw8St4hMb2aSdcyJDG6zGsjRnztI5R9CEMLf4nk8j0toMJMEPeNvaIr5OaxBknI5dF+s87dHT3pOVDfAHL8xICnTL6uHb+22CZVbD550AGp8RktIUZuZ/CDumtsxtZRy2HxGCf94Gc51RiS0Mm9wz4csKP3kwguCrYXrq/O3+R5CQrkZO6ni+uf4OxeMsGguDYoqOLYTCRJjOl1CHF6/Ee5WoblAP0qC8orhhE9RbCaoDD0MRcWl2J1NbR3RALcrJ6Ot4ouAwoRT1AcKEJJpGvIjHcznMwyXNOJ0lzdufmI05kWStCLi7UKKOMSD1QonG3YW98it8eiaVo5BJ1r3Pa8hKChsPUEQMdA6+Lgnyeaf5VGGrgujbJ022yDeULsU2G+mkHoSHhL5PVjUQM5rjz5aYgJrkHYC"
  },
  "bernard": {
    "salt": "nv/aVzZzakwxjbbsssJ4UQ==",
    "iv": "9tlxg+0WLrP3AR4e",
    "data": "9q5656gTGDiBwk5ylNQU7eLclk5TBjg4RgkDBnA+Fk1YV68tnORcGsAH6fzPRXzXUq3QonOAyIdoXxNBonWZBydfS3C4EEeA5XfYCo/WUeI11yqvJLyVkuIAi4ND2mK9QcISFo6LcgipPv0e0B0uuSCyyUbMHsPZ1+SEFk/7/n75X75X2z7pTUzrIbZrvtMX3OXj4KwvIKSELvMd+l+kSChHLTcYvXF4kTRlt0hFESLjaJxdh/8+m62lJN/3mu0oyl4Ynhr98IxV0MhKWkyje4CvRhiiyk5rhNE7CqhfYt+MdpcOU/81F7aY09ougDWoCwg+2DrluulqobAWU2vzjAGUpk+lzknqfa7QSCE0d5nmLVZD6GDFzp+GPEIXWTN1VeQ69xFBS5UoN21ZdSIubU3i526IzUR04igxJlILeXMexI8M++K7TsRmyhdyOVcJb59w9TmU1P4+sxgoFAqHPsVk6lCUbfl5mD29n9FQyhOHL7YfPRPh77BRNU6obqVm0L6hlg2vMeLMHGd22x2Cq8dA/rR5NGVDlDEdvAh00GrC3WiMQIR2qxcwF0aLQ1Q8M8DDsrCdlPksU2epnUYB1Lcwqgci3q0Lkkg+XBACWwRabdE1mh6y9wELyGVhPtX42Qn3NAakexyEMiAJHtJce0pJFtBXQryasJYjhBac6gEVE1/6R0fDx/HQ/a3VoLamqYk8vuRKKDbL2GySIXXdLp8LwsT3+BHoO7rnsVas/ypCE4WQe2QrYxpTyNPHT0deri2wKYKmv6fWstyftJv/VlFzrEyqOOEZjwVpe+R3Fk5js1yI+st2TJczoJ9UbFVFaSyD3c1vJ2gR5SheiAbNds+RPcCNPfrnkvfu6SjtvbJDGzEAprAmOELhdjHFCyiQHEHyJPBRAohnLmXfeYu+V1wHtRRobTTKybJVUwdUBiA5LEz12XR0a4B6D5ZK0Rh6XUaxkF3J+RJVvd7wfAeRLvPSK5IJOCoCNR7WyTOyfkS9kxkLz0zsb4C4MZn8+4dTIsojEVdB33cBdT8BJhPVZW5aZaKC4dG4+aXwlmRHzKUN5IK7qhIF+sidVjHPM1CGvP6AOKO2D53SfnWdixo0QYxMu9TabW3ZyJDt8Q+IlBHkL5UObWh4HcXg76lpSkXfPivTUjdIuY8WLmmhC8ynxCIO15Ry3wt0mmetGwoqLwb6Y9YGDdzWAptQh78UykhkXeFWXX5R0VsUVhYc7Jvl1eTmgc5RFPNfZDc7WMWO30mYpHCXlITlWd0D/3MdZtjxESjG0JT8TErLJP6lbtm8RpQvOxN2DsvCqMztEr+PVRyM+vZKoyxzXfbzo/h1M4vAb4KKE/0YVBKHNGo6kI6AJeUQXrUdWyrHRTENXJqoeXfHm4AFTC0EoJpL6rps0k6REdXOku27cfxDLTD2gjZknl9AI7NIr7By5YzFbD+TjR4b1/sZasJmuEP7kIIaJPGJdDdBn0oHxb2ZRqbSHQvHL9Hpr645T+V0ROn1BosRHPC2fh9VU+l/ZdUfrKmVLTuI3iX/dQVxOv9+8gIvhSy51zutrw/dSMc+3xj4ovnrWCKYKJ7YELWNNdp3/+t/h8MiN0r/bL7HMJHGHCDwR8AthH0BUFPR7gYVFUz6ZDehXzGmgOlczOhaBLznoxXXSn1jsizzT7XNQYrCgjgh9f5OAq35EtWXWOvao1YGtfzL6I1jxhfmkj56voW+e3SMa4Jm6ycKBF/+EARFEq96pCF6/BHKvbgMUhqxxkejnR8h4A4EG5IGSADi00/YI3VdQUgLWkd9J2nrzeGMK/tCBVMPqQtYOIUbuC2sPi3VLFgaqP63dIQqu9YmUsoIzSqJ3gMGqLTUKXlqcAwn4iALZfflD/QUywLGfhw/7WxdWq/DZaLyakBYQXAA8EfoCIH/pZbtTYdvlVY6BVSQfNpyvhZxraKL6MbIt18Z0Ig8ACgxZy8aKxM8iTl0aemN6OWAKkZZ1c89IRUwv5g="
  },
  "lefevre": {
    "salt": "pqN7anxtuMvOWo5yBgTn+A==",
    "iv": "B7s5121JKjQw99k1",
    "data": "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"
  },
  "garnier": {
    "salt": "S5Ur99RV8vRpYoy49Fhp6Q==",
    "iv": "2BY9p12uWw0Z/O0p",
    "data": "XZIfTBVI/YUsP5avZ8oUR57hd2RD7j6fchya1gZYN0vY/vZ4iUZgoffnqPeKRqBeiX9TF0ShoSh8TDhfMQwla5Vh4Is0bWog2tk6sMQdrw+xpkq2pJCULJvUu6e6FlY8XIG25DtJ9n3RJuEnEMOdlqay/AG4/FCFXs0oHoI2bcUT5T5ebhzzmAl//C5P4qzOfl2fPDHzBs1y2g8Dn/hoyl2Jhv0B62wmXak8/3mKW7nZ/mr70lJC0654WZ8zK9wbBKCh1iv2a0Z7g9uwQK+8g0g2rJhs68EysTdqQV252+zK2VoGJNfQlH30XDzbmdgEFC+nCkDCCyAZhD4nfmEO2BY1rfqzuyvnaEyiCjKq7b1Inz9hyKMHkaMpHcmaGCl0dh1xfm+19pPxhtqHyNGlqyxonc69wbCKu77YBnk7MGJDKZIYjbgJooHRM7o9eB82iQ/B6HZxFtpIfxO9pIbCQ/jUhl1p38z+44P9qVSJs5cmqQCLy2JP6zTnJeNCp9O2jGa8EnP2FNgDdezyGqRQwoICjg7CAotSb+XLkNgKYh/jZEYsVimt5V+4wi2woH+IB92yHxveVu23Nyx/kB4kv6ZooiLbIzvbkOSr+Qw4V8FOyKZoDxax1mmH18GQdPoS6YXrMz6Lr+puNgEs3uWfNT7FuHqtXRgkeDAzGm3LtV7IYAm/ae3+AQg0Ij4zKj+zvLPS9umjf2Gb/qJ9FQwLqE+el7Avs+V4GkFXQkN61CalImRUPk3IxMyrY5/6S57gPLy5QHHCtCDfftzSTAreMLuXNBIEhZqkvBIE2WzvabG/y1GaJN/IUxKqLroBdYeqlRDVWwSnBfOP+WRXMxOBjZVTiMgZMu9qIBJgGGsuaO0nS+J6R4zik+EGL5DCnBRo7CkeE4hXvJNcTCTYIXOFKBr87qVfmyb3LTvh+X8UEpTyzQQUEKokrDCUJjN1vYo2+N4kvKrOkfZh9iOhBnyTCbwvxhdBvYvtKT20iCir2IWWWlq4TPwqKqgX+8feamqWLVxQfOh72yQiosE37CB+ChDyRruwedfK8CTTpqFMy/8ihM8sgy7dEuGRNrhlzQIJ94ZZ/YhHn01BUhJygI8d65i7exMh4sDp6tLnveAnC8SWI4uqJ2dsVWNbdT/Ij7JsFE2ycd7AU0InkXv3nDPpcCgzQd/2Ix4RRwthu8v6+xrt4A1zYeGTbs/4P+2+1aEss7H2fdT3nut3tuYTDt5txFYJ/hSEMHWopNclkeaGalyncVQx5xyI9qcfVMriPLMFUZozJ0FsZRdPCmqzcZVnQW5MGtMZBikV9IMhdrZKrt1e2KeiyB15mKmQ3/XutbbDijixXqHOZxTZcqLZhz7TbU+UpMkACDW08+fefdXYQjIOd31d4CaZaoo+o0f7H88+yGwTNNbM3frzpUJ0Hu0mXZI/EmRTSM7hnC1whzuYoEluzkrPrjKhEdr8REh9hHsDNaCD5NG28pvIdn5AEXRcyRONjb/h4TcfgMDK3N+G2K4ec0MRTTENSfVg3/WdSg0FiBjHVJYUYCmzpp8grD+VvhbX+3G+lZEkCnTZ+GtlEoced/EhpUmptf4j3+gM4YqGkY1Cgc4uXvXPn3SQ3p3MfhwjpvC09lBF5eRSyZP4OR6EYtkrCNHfpAsVAgmGCvpI15iKVWynxiiDgeObZsSZAfu2ftvJevmISLGHACzxiWC6KmMT1VhgVEkr1v4lxg7rkGDDD8oVen7eatCTlheJsBGxwqg3bhnkxmcja7Ot5BnpMNIKOShPfRNd0a0EdAL4L7Als7jHY+7TWkKx96ZwKBfVEKdRgnNiMGkAeit6rurlPIhR/y5yuhgsz6RvZnrmHncr60VFiYDVk9+IkoME4Xz47I3IqdrjNCG4s7P4H18pAReeZsgkTg9Apd59eEWM80tJLEgibiW9cJUezBnKYTsEkVcp"
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
