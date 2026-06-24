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
    "salt": "KlNMGwWYkejp7i49bpaxSQ==",
    "iv": "YxqimzxDdNrDJo68",
    "data": "/ipW+ictmcE8DYkEl8Ojqyp+ECSn5G+WqEEItlbRo0gKNQHQbhbDzapjG7EipPy+ltY0Z3DJJ1zCmkJUiRiNtwfGuTlAj8A41Bob24oto4KOwY7y2diAuE3WQnxBJGJc6aNB/k0/RilRY3HjPdjSjufg4amc93vtP1AiLj/o1nzGAf9mhoA5ERjHxXtIgQI/u58VR6NWl1H7uZsKzz7KYu4ZX53YUinotFX+xMyFfmygwg2I/3AKhEilUfZm7uWs+z97C1MMIfN3DLDHRZ4wED/1oSctcT59ufHOQKw+p0SmB7k3oViDkM+eqB8Ffc762NVIQtaX0u5nF/Y/CPTM9ubxdvSFOJE0Y09p2HIG2TP5EccsAyFuAwsAQ9d+kuKvg5syi9iAET/ykPJ0a2lTaBaUZa7znprXXxbtjSF4kCkH+BX4T7LrdDB5AYiCy1ZxO06fwD1gHuKLUsS5k9NMzRqyP/sfhrKExbCWLsvdmholUYVWyMJ3HIr4jvvle93CCowd7khDjg50Cz4mFggqJBDbLznT4r2KjHGPZOvkiehYGsJwKGmB63zuaCbnsABDzfOG5ubIlaUzNHdPwZP+EgBUdZUuGHeGMZHppupNaSgrhYXhgmoHFR8rsZlF114kKX+dRFNKLileez6HbqozxbTQML50NK34P5avSAQcoiTe+mz14eiCXOXuZr44ElGSBvtiAKX1+U6B/fo+9TisQvhg9qAGyMcHB5Syc3gO+GJGP8jyAFTaVG5zdXte8kJbIPZazpMlJhW3buAAXcKOaymd3OjiJkSUBuaRFZ/CcGSMHPs7AVIgMWOfmGCvjbKkUzZ5w8RlGxAm11ABJsvO4NhjbYrOZfZH6sakE2/jrr6HFqB84HtMzew+dycBSAKS/po5kNXifjWmtduxBxxl7wyWisLaK6xJCor7663qc9VoQK7RhwrTbmV3OUjoXpivJslHyYvVY4495pjIdUvyszbmNd/Y9dJMlze2F/KkdULToy3jcRcD7VsIu6wrJf+wmFOSViIB20XlOuyn2KdEXQWP5wiG1V7Mw/fyfS37fp5Ikgq5BRDjX9KmTvq7umNbHlvzvktecT5k0X3prGJKs1MQTeeiL3AqvRykor2uuV4KFBybstwcm+t8r6VrZ1ofbJjS1a5B2j0gqlDXgnlKFrNO4PXoFNHBMO4QBDqYFwRdc3ivPe8vBNj0uCDs/O1ZfVYhJVM2wNoVyDQX8bFdRhphKMehcDi1v6l1MKn+KrUQY1+zQBMz86VakMPV+oepXbyAtRn1MRbjANeDhP6PqP60q8iH5aSLx+TcIvXBN671Tm6C1hf+DPf8JvqqB8uCfsOoJJTh5+Yn27MMbyeFbOxs2shSppCIh0EUSc5pFN64HBRIr64XlJgJHMDdu/a24nh+JHtSwV8IrDK7B6pfnOAxKTVLeeR1cmRe2FgCEhzGUgrt8UG/iqXalEbwNAuca5Fo18hOUA8WSo7xtmcyLW0RPFm19r9iS9Pww/sA6vN9pNngXY0GPoI8xteETPOFCLACj9lT26mY16dhNIMRk8DRD6HHWcLTrDuJGWWd7ASdEpry7jcgjgwNmcK+BImiFMUpw0nOYilDgIOkreONmCViOTWr7m/jqeO0WonCedHE0c81fEtU5QC/7Kr2KotGLfZrHRwMFeOMhz8bbF7kANbJO6lSGhwNWSd2w6gr4HzoDNBidhpuJ1psjIR4rmhb/xx3iMPQ7Fe8U20cJnQJrh6buFwSHGE5bAop6TD1tSiXg4KuCkQtEgGkszsX3MeffAhdY8jnpQLO+GnF27FsGNWLQUGzDL1usVI/mj186nS5zFpCCY0ECirbHhpY+k5tycrHJxnsdP0M4eJ8Wi0nxnY20hhH1p0LAXL5IWjeCVpIKr2WhfmM9UanlWsVxvSRUopxPml0m5tGF1MVRkNrgf3stAyBT+D4sGv8X59aD03zOUoQAzFh457ANb8M2kL5cwKbwzEf085s0zVLqmDt3k5S/PcjzswSYuXWEVJdpGmKmto3j8sv64I7c2PnJD3ec8UEri5pHSoW5QU1E9AoTWNPwedXAhilDu7m0opIoRRtSkZ9yshMD8bIKsyflmq5hMsVWwuIpqFM6oTCU7uK/hfUuMRM6CJ6uwlE0u8tTAkeNz4OmPHUL99buuNxjJZcJGQQ+97S5e5Dkxl3Vm8VLlKwigguXbeLhNfdeoj0oQTE9f0QPqTNmh+h7OCEIAo6bYsq0cX6UqfrcxzFVIqiRcSEjhd06bH780de6Ic+iE4w1N7u9bxvnQ8dsSXHYLqJziVr4zCdzGPDLx/4MRpmy6GEkUGDu2XWt1pExniQRr66DYWtjMHPH4hHLyUiaBMC6mplzEtuQGar6dVwIYypgkBOfKahDszZWmBQTaOQIx5CQVmSyT/Y4zr1ZsM6tRRsm7EVp3lGb5FRSF7CSene+impvuppvL52iQ=="
  },
  "appt2": {
    "salt": "/SMv7yt18LTStqxu7qjicA==",
    "iv": "V+YBhH0YDyUBWPNt",
    "data": "/OgwrJIWWKAhyis2IGTBV51dPT3uZk77slEJ+woCz5wLi2IdmO5f1v7n8vprAbEmDgIts6nNOzb4O27m3caAMBJPVlmYWcQA3ygmHIIkwvsSblz+AWidkVhhcact6ioXN3HxsjG6QCVaTSNo8OSIta0L6G8Ttw838PtlGx3i2VsZwHe9JOFZtutf0nUzbmgWwfQbXhCaBgftPDNnw37AfUG0khBezXpcf/vEwfunKclVlGKnAo/6WtSuE641Q8TgVNnYmf/3gB/uC6XeRlUbhRDGKJyVeG71Ljjnm2v1W3XL/TLfKk7N+3HzhdYregn/SxLNMq6RZ5x49OpJYQ2KMI93FXX5WQE+vksN/QDd7IFgpMH9MKpxMJ1fnYDmUxce+edjfioEZHpFQ4SUd0XKdmNIwSlEBvVyTfMMu8YFo7WAajyAQZS+VH4bQj7VvF66tbcgjyqRBGekYfesEoTdtEXDmmJFgHQCvOj47ARIvaBvC/47ChRpEHYXEEZMHH2X5+gjdIv6cFQkfWRvH3NMRTs6S+watlWrQvnjmlxofMo77pfYkeFe6yrNZTUtHuRzz9eFdr1XLKqW/U28M2U2fMR05lOyOwlfJbbZ8E6v/zcpUuI86d/8MCzzwNoB4a1v+tmVMgb3WaQ81VuTJCfQie4xIMFZNJAFkTou4LrPFLShHJzZsYQKlFMuefmLxbe0IHCko1fOxaVgJXrEXvQDOycrOjtXe820SOPWtqbTqrLd+zmgrBlxvx27FNSpmVCgQBUqsojvlPEED/8gBFwzPpq8k/fP/OuqpdLuEKFvdFmPKW0xWAFIn12/ORX3lofc/hE81wJrNuOPXJn8mB6o4o7NGbHGitytA8wYFEidTfgahLwI2SSpS3wkn5o7kF1LGRn+vpCCLVrYtOPrQyv3S5USpvnGhGSRUvKrwBYfMZINlyIz1ET8xEZd1WXc+GOtKhLA4klRzp7nmYpkx2hQzJTxgg/t3CJAelHFXdtKkQDdxdYEoWO7mMNZJc+8SqZ9A9gigq6Jv6woiHKiLctDc5cONsgFUTITUteLoEQm3ve3SmaX/5UcX8BsM7ock06W6gI+3MfDhXSP0A+I0AbSSg+SEyObtiLM7gnspenN1D02iEOaBpND+xuknvmjzyKeNngXBv+5QEQsikwyP9WdIJwjLhmdVcPG2kUbdyJuguvFaXxo73C4IK3l7of2dyWnS+zIcTzGwTl/80bQ1S3GKB1APRH5le3vn5tnGkcnAL8KQAxiQmr6OF63En4jMztShi7jztPSGdJIx0P+9lrvlpqYMqs1LhkGKBFE0uV9Tk51oxDZdKcaND0E0RLD0UWx/P+wDPNvI5TO4M7qCr1mEuqZ10RRSurSWgL9SA7tWa1KfXN6gQ+WGpQM+qILH05srUkJb5eACIWKX7n1a4Dk8GuSFxwqI33A3g+afJW9zdwRvWGkmtKztdbQGmJJy8cbLIhh/qNJt5zZ7gQIG497Is86PT0xWnqQ/QkSlRqMlHxdl7THcjAhKmJwERqAPfQ2x6ZNWMMQXv4/XEOoPYp2XDQdo0yslorJDikoNmcgyCUyLdrh/08Impc3F+U/vCxGGxBYhK/JUFG1UfQ="
  },
  "appt3": {
    "salt": "jfyf+SlyL7CaAEqTl5PWHA==",
    "iv": "0NxwuhIbiHAFtXcj",
    "data": "zofDvjHEFLyMJSko+amzFkki03qZl+V95xl3NnwIWrDp35lQhDcfAyyPL59ZeFmJnbat8Mchbh3GJCXjvIwGMA4aqYXPGsYR0JLqH58wuiTFZMbbcyeeRZwj6dUFu0HOqNaWcqRl0knHTfckj5hjeN3472lqgeWjgx/h4yqsiHHDnn62IE1sjYBrhX1Fz8otp7ukaeBb6boPe1+MiV5Tg2BjJHwvtg3CxH2pzW/g5VEqyQxZFzZgLc93RHaUtfDJ4Bu7vSbPUeSPPe8ju6BLkynrtm/O7LIpOQ9BfTKPfaFazDH7rDL9HITOR/hdEgo5Hq1D3TkwJvJ24pEdrefSuVgEGJJVAfWrW1QihIPfoWovuOXSVncmJntXXSBNDiYzNagraM3n6saCE3PkNlcik6H/ZLN8IVRFSfcI6yjlUB4ULHH3NLYSv+Ix0NNIc1AGnkdq753+4BoeK84P6Ux/J0DW9AXAaCTFjKrrJJwUUQEPlKaXoQGmHCG28BznvSoJiJLBVvev+DuHYv0iLIRpNZRt0Hdk52USkm39Pb4rDeLultB7UkuRdWOaMEh9hRFpRnaLr3g/wsx+oH38JTPo//JyXnnregYgw925xEmIpkOpazn0TQN/gszGajgKHQdJT4PHr1wfKpy0Kg48wTWh6/VRBi4p+UBi68t/0H3PDxLjqX1rqc3NymmxA5dASxCoRJjadcoJgqsmAjjQTLZSBGYzJSrk3JJ4QPry6kBSBqdUwiOIOfDyamCG1wvV9IhQmIvcy693WF6SOhRz41BeUEHISL7be3Y1uVjiGoydSZMebZG+V8J78R0743tVDrGiUecDbNpb1Y3yJLZny6pThgeBVzXmczmDxaav09oy1fh+j5VSEZzE/IzmlSD8JE4zt+IWtAK5wac3RuD0rtubTR6IC2/VwCnZKFJHn421f/Z+ewie4vlP9qaq8MY6uneWV7uR82DgyR2Zri79jpHZsn1kED1xlex5+nriSYVXgno0/Y7fKHuivNPPkUQ0uUjDjUotlKpGsdyvf3gfXoiCOQklkL6qQUeykGYe3EsiztN3EXannp0fsiO6CmNC36WGU4Fhf3icRSWgqWnLCUS8x2oK15+qYNcChvzR/0QXkP+5+KroYDkwgfkYi5J9S8ybp6jAM4mCeX0Gvvofk8XtDVagA1GzSIcVPji7RpMms1tTdqrNeb2tw9NuJCuGWMzXWwRcpNcqbaWRpnW1FayLSZlYtex8LJgzeshm1Knu2zix3vAHB5Jwa3Xe74WbF80wNAfX/584+cssVzQNGJFCya220z+7crFCrkZ5DUFQ4pnJBVsBOLg1vNhe9uBStk60zI7TX8G7aSRxod569D+Z72juELNfsca3pxyp8ec2vJBjLpxgKpj1DFAPdOd2wszKqykPlwXnIkBn205hMgMy4raBZUwqnMP84dBlydCweTNtK9389KGnAMgETkVo92ckopRa7iTS8ifQJou7SdGeaJDThlnTLSf9HLg87JARSm4pSFIw/BkrhfTr8g=="
  },
  "appt4": {
    "salt": "9aNmhljbU4K3R87MEca2RA==",
    "iv": "oPwmrqa7DvNqD5lK",
    "data": "fKiulzpcYp33WMPRc3kGewQCs8U8vE+ziDmS0rQ8wRk7e7X6f1pqenZ8dfylCIOEFZP/ZYj0SdXxHSKvNlavYy6rEWErcDMzr49jkAPRuh37bKZEUzStLRqIAf9rf+iTn7cIIv+IpJqARtr3nqdGZzt8IJQOXR2grIJkSdq5QarQ+/VwtGehgKpl6S2Uh2DAm1FrW1gG6Jx2bafCd+tXgvuTr2PBpe+9aZ1fRFZXXB4PRs4v4YclVk8AaYzTvgc+w2KIsRou4dRqXpfa7w7gpoCfGa+0GY3m7L5O2UgqfQOYiq9HZLuCi+9xbH2W65uQJGjDpYXVPTYV5LvR8LwAZ7BE5Po/o703DX+TTgk4oSh1xdfy2wpsSK+3NFhclYHUdJj/IgHQpgCKqsEziqsUX7rd+Jzt+IOr7vrj5fmupaffShRIxf7B61G28MkPGw1QyR9n7ADNaZ2FTbJ4NrK132kya25NPmDjAx7/rwj5MbWvVJg2JYr8TZhKiE843Wd0E6Bd/dtJiKqWvyIg2V0KsP7GjHm5ffnMTg62MwOAb78A980fIltocCbDaKPiR/v8z3hgbzHz8jXc2S2Ltq3GLTge42PZhCtVdufBjHbAHgBhWfb57w9NHqnOMs+NOdnzYW+4q8i/7lBbjSJnjZn/iCqyR5XiugiWEiyls1ttADS9zEQ/0ESn3AsoT+o5QD+Igb5nHmWkM9KvUvDG8R6yOUX/agv0A5hBPCQHq9Gpu5f66MCqbQgYBnn9dsbrCF1LAAsb3EoOZQMikveHn0pPR3khzJ9YM/RZDiodF4o0mmkgkhf9yTRIKwXoeZNhdlKRMf1nFqZPuRxmwptdy3G7ipT83nF/Li1ddYZNCbyTe658wnA9ffi2TKzRfzw23mGy1kYv52DAvDeCaqO6UWlMG3UJnHZGfgnsXOikRurjiqIyb8E7IgKxiYULu79JJTYNNPufpH26IHXvKGkr9b5tdEfWjYvwe3WbwH4VuLmINi5PMosiGvJWbPqxNLgxrYBUJeRdBh+guFuTVf4ATJqYskYtv3DsSS9hzZ9dc7r5vh8FF/6kkmjig0HxO9ySWC+xB9ncDRYKdjcNWfsXaCI7ouaKAjbpvrAgL9VYi7MZF2rludSQWDa02tp6EKizDtmb9rl5cs3FaE2bL+llny4ifXQOs/sp4iW7zOMfmLz8B4ysNbLhN+GrYrytkH6jIS23tfrHJp0NU3PVioLvMF+ewpX80rQ5F6fsjmH9JjDGzRHmo5OSVbZipVD74vn3YJuaYD+cnAxHsQqq/adWc08kiTLwN5lXNMfl9ujSjwyO33qvqG0O+p79stacEO9DswBYgCDVNJ23vHGdh3UcllN/osgFb662NB2/DT7ED0VrholkIYrlTjCgqJ/f09G6yfMoxFFCNioRdtb/WMBZeqpbQ1OOFcsL/uf0V61QHuodZt5Qy2djz5f7IT+l5K//XCKiNR/5OFsNpFhKlD/T5+Ey4Ov67XATyiTi2jP6yWbvtwb9H0e+zxHxHNYo1I2hFXKZEC1W/d7tj0KKjSMq4ZbniAlli5onAkosrKUm+4inp1XwkVbs1diVznnvsafyfSG/NMNSZUFkhUhMjdDT"
  },
  "appt5": {
    "salt": "bwcVTEqpmF1NY3j9kXq/bQ==",
    "iv": "QqeAbFAeMc+7YtrY",
    "data": "am+4s6N+zCstSisl1yJrDy1qy6Udkl5Y+NLxd6IcHp6rr1PnShbShonqSpQ0fRTYnihU4dmoSkzXGrpAMWa7EIVLbAvyJOQidBYZoZcyrcbhxO7Nj3F9nj/U0sFN/vkAdA3bkoRvp7rMrL5QnpgWWPTf0ouryDJU2EMWeZQk3mwHZXpveGONqINBADb4qPQvRBVY09oP5sEbSBN4cXBePKYovT5pU2A1hCe3zC5+IeSfQ7vX8RmBTGEJYeem4toMGP3gYIXK7NfmmcOE+P2IWjCMogKnH7PYPUqQkJsnfWfGxY2DVOmdF9RWbB35/yrEB6X3LuMo/VcJr0wd+nV89gLH5lizR8D8tKsgif3r5cfeN51qWQgzS/BKpXjY9rXnd2kJ0fR+teNARFOy1CbGVLFTZFWt7lWsO4nhM8ZX+5lEo/nvb79QHslVIHDKMBSJ7Kzo5K64uApyuVY6IBMmfXU49KQ6EsMv9o955vDFYv50XDSUvgoFHHk1jWN+vAp4SJ+1CZUdiQ8xbidkDlUritHStWDI4HWqg+7WFkRv+N2undnpIBa+gNcdw9fIgtoUKsgzAgK2q9JC5W3DahAGu7HFZsEFjx6yu9BjWNuqUQHGsC8ob20j5IHJGtIImB1+Ep0bnHK9dgncWcH03w8gVRwI7ak1yu5bi/XVRuAG50PnuWNkARMYF0/u+5hSEIObc4qpDxKOpra2uY2rc4wc9tKATnigYsMeWUBnaj+MHb9o0Ow+3sdPT4psh2OnIYBwJf7cT5HCZSu6T/jnqOkIZ8vi2lRrQKBIdizZxZOYMoqbKsPNtUyPh8O6LaVmDOXw9LXZwI2cerxsFFu3TKee9+VaeLRcX5CuIB5/0aKHw3NTx5V0unGItL3iwYqh2b4VPHKmHlgcmUQJ5unutRhzvxko7a+utruX8E45bVoy3GidU+dsP83kfsSJI7CcdxrHFF2hadfkFLcfADF7+DbLFxPUJ+XmrJpbcUim1Qs2rEmupDBw4Bmzjc5Gm+thfQdTlKiNEo/p9Y692JJGK1cNlP8RZM/DbNB+WOGNIzu6AExcBgCDaxpgwVN1wf7HWmD2qXU1nmn/EwKHWNVEKbsXlQkUsZCPWLLFnqlWW7hCU8/7uIMIh7qURbDpe56fPbxUMDkmmub7bqmtyO3lbXX2yy07CJYdaTR0lGFY9XCwpTnz1GbPqINB7K2pb7+KsO7UJikDs2CbezFCRpV7CrgUDCIqIZjVByGO+o7SyE4rcqZhpJwPq9e/Z03YDyL0fgIATaXTWhXVjX0KWnkWLsRF7cpl7Cb94EXt9dVlWjFAJ31F0Q4tBacMcZjm3jHsliNzrEe2rCDoH5Mux6EnjCkbpDMUO5VFIwSz/Tg2vmGntjIcOq6SDAvZGK8YKsYQUiWj5QjB/mvBTO7qwWDilgOJxqY6aguUlOVhSf12xtoMztFAEABMvgIadWdxvWKJyQMVS+h32r4/XMKU1Q8fq4ysNOofeMofaH8zuxfdG5xeJhnAp8AeCD4ehCLpKYp+DiM4/sfK1DdMh1SZQbQR6eQa51H7i+pvSJI+JowW3/epnXSqdHg0JgXdiqO46svwdcJCbTfShptMf5Wl78sjXOoymJeRHusuNoWUja5ZOEQxwEJhUNFJlOG5NwoFx09mb94YBI4ULdwrapUxkoj52j/uT51c2O0aarG9UfuL6CU98bXvOXYxCCFudETuRz24NUhWr+TEfknvgMPmPmmtjbSwCKniuqFIcHF3REGsZnJDRl2W9QkFU3NhFLRRIu/TGOc95fDwvwccFAUW6mKNlRWFfdNBW+05bxI3T3XYSipInHVwI4tAuxRJ2a8nPYXjf/c7Web08Vo1BM/fDS/Ddp1QBTHTofqGSd0wpyfTUD6ScoqYuLMOFXZfOzGm09G+o66Afq8Sa0rUAe1l0InsxumZ7HiSp69VL/+DONafEcYINzxgdowdXlxhUfeomW+jUyJUg6QbsJ6Hd5s="
  },
  "appt6": {
    "salt": "29pGPzm8LFWmNOFf5ImJuQ==",
    "iv": "9SuWKeHjvjmFrsD9",
    "data": "WCBJTUGUNoTB5pzdoZq5y6Rkg5smAcGSvk2pMVrVl9FrGMR/R0ssRRypl5wYiIoFCfzZl4e+UfShrnRfAd8TdT0K1P6X8dpVxeAs9YeQqZxpNSmB38sma6pPLlYN6tJmI8/ODiYhDTaZaE42qQ7grq+lZXn3z4tXWeL4Xox+DQvraeQO0gvIc8WndDpRW98EGK2cISJQCMtd6rzNqp+5rMaBMlVIrXlfV/rlRiHZB8tc+GtZgf6LCTAEQCpeKLPSItEo7UFQ1sRSOfDkvx6f16f301KaehQtsfZDlJE+lLhR4Ww+UDCkhBLPdz1KPPyp7/AyR0cU+nANpl1pjC0GXG2xjh1KDxLQDBfY+BLZiSs2uhAa5YqQ0ugKx02d+CHDWJBXw0IKg8njHAtVchkWGDqWbtCjM15uyEcXiBZGdnqOnMrc645R6Vh82+90HR5DMmp7Eh5TTCEyjae/N9UO9L3NYitOZ8p+O7csiY7FZn0p5PhqLzyvfHvnG4d2d7sYvftQAEsLAWK8d/0kQASGpoD7bCkTjpZvgTEsJQunuPVgxU46ebJA3VABn8HUNwEzBAWVBjq9MKJMAE3epOZYU0vEO8ZSsU0opwGCPU0f/cjMFfSk5KeJYVya6HvyLhYIefhHzlp/IxpDbOmBylcySoucd/2xTSyD8cyrTPVtBCqBcyIzmVEwzaRVa7kUXI4O87Hu8zRbyMXN1TqHNYA0MzEY+SQ5L1z6Jr5vnnfjg1QXDF4FqGwfvRGDYss0o3Ugu5+WBzQjZN1UTex/rpJ8XONOzrjUGa4U0IqvxtSeq21k7COvMFO1NgbpAX6binjFuwVhHP3DrSuh9YpaF98zj6RFF5kGIC3IY4/3IENQJH2ptt61vCGW9EVDXFiJJZ7yv9YzrbW3fwvQ3AEjEw/tSH4BW62ejYdkgT4+DhhvLkLIkVVLAVuC4W8KCXEIMrngnyvo95eVMf8BpjBOFnEjUsdP1fwR17+pMd1X3aCaZunr0PQvYV7jK+BciHdXJ2LZg7OxIC7Sl/JfqMCLGgswd4XYCvTgrVfnVFtHNTr9+GKE3xVzTLTo+EIN1MpAn6UtVOXKqgqruZxK/sVaCFSBqbULoXUDbPZTK2r9oMhhYJ5am816nfOOKmNCjV1A2EF22oRp22DTFyIRX1r4PYZ3QfMNkKKX6M4QCe2DczCjSfR6qp/aaoAlI7mzjxz/GsDBpUgQs7qxSvJu4Ulkwyw3KCOpULFKbK2gHKhjBy9nwObc9CL8JCTydmGlczcsBj5VqU+74dYwVit5W6UbDJV/3hweVSWV6K8NyfkG/tNqJvvL+bfzOxlgZQegBYc20bJzz2YTikr/Zo6EAiqoDojwctDB+8uE4FcIpRwdftz4F5qKHqKSDRSKJi4nFc+NDrJENd4Vuhgg7/U6MEspqGlBCEb2+J+6sfLkpoxi6L/GMDPpltgLIpvr6B7C0/zjXeEUNjB0WuL8YVRn+S5fqVkemHTbRzCgcBi1roBs1w4rl58Nz+1DrTLrIlK/rCjqPaJE0mSN+PQSef/4jqdU2XoV/lq+IrcWXXaf0j2RZFMIyYw/Gxo6YBD//wDLJY3VwcjdmywENT4Fvs8kKdoBgcLQXmnT6SJbWXwVejUeM2KQi9bqMuzBwiXOmESMjq4dQvNXxH7KhE/8Xxtga5/K7H/BOQmN7JuFOVYslPpgwYuk1y50uLyGUFALdDOb4E2Ke+6uGnGLigMen0a6k0m2cTs4AXeIgDH0qwgK3ni+v2To5Z06HZqnCpqXMH8rQMjgYFFXkz2k95SVAjOu+h7y0wuMzidvxhkr5MDb9heiqFTM1tU2+FwROqALqh9Np8g7cJt+YsfIkZDfW7olnBCRb7hpAm+EN8ajqxH5Y9DKLu59GwEl2vA="
  },
  "appt7": {
    "salt": "peANgbYphsFTZEqBZUgu6g==",
    "iv": "gXYmZSLRf6ddKqs3",
    "data": "eYmQV/V8CjRsfM/dbyaPtfz3pUoI7voYjZLxacoMF5CuvTqYlb2pD5nwRyCy9xLSDXp2/D9REzt+1QwMmg94wrNj6CAFuKDaaojwOdXLM3i1vWIQuICPbxuKRlkqzEYKf2QUkdfh//O4w/5rHd1Z8jswU8dBdv5BVLxsoM2FVPr7CtHFj/5162QzcRqvL+VrLZKhfLOb3B7o+grD/egxIXHtPUttBcWzsWtuLL4dWiyXtzIfGC1EpV709jKpYnxZL6qPJ3AteDpPaWrlue4roz5RpDWC5QsQocX1ZuRT2Z7XSvrUx2ca5fHZMfNxq2mmPBt/xT9mlNloIAUh6LS2Mv6XnqFbHoNCsC7x28Q8lSPpQPx2zrQ2XKUPGO3Ql/V9a8ecC2TOOUInbfEzHYP2AzzB4xhxfLksJxOgvJr5clz85GCxHqXabmAzOJx/jspy/XthovFthOiNJWNt7d8F7FtRlpiMnzhX6rtnx93aM/fqlMSKHkqn8baOm/2mLl+wVpsJp40a04VQTaaHLj0Y86FcOlA7eFMhVhInhu5Rg/sZBbwWfISZESKo7oJkDtwh6qMA2emzshvNrw7plqBl87fZ4O1Azs8FU8MlAf1i+CcJyh6C9acbQkMqajIeIMfk0s5rJWbcVqKG/H9iqgjhCCb8fy4/5HEdBGLrPZ8HZk2QUbpTjYdF3k7IeSA7G/VkLffHWH4FGxAS3V5GBbaeR+8DYwUzMrZN+/gUFXUYXt9WqXgEMIne0UFestVB+ZDPQ09JicIedbKY2EwcDEXiKseZ5tb410WfrOeEU0h3DtVYERZ43RtjNUarYDA7CigQ1/a6mRlLEf4q+p4QoEWg8GrNWzKYqjNN+RdFXQzhDHdf5bPcD2n7uBHyOQ1NbNYC+/0PdaRQg/DkG+iNi0J/C9R8DkeeSzy/0EeC4zoIEhNy8r+Jp8MymtWXuuOZG3z285zmqZ1LXztHca99VUn4we3q+Qq/Nfa0XGtpzKCjtMllElWtJEv99v/y84vsLkp/r9ij/SC+ccf0hFPirgpWhueGh1V1G3JPxrPQorqu7TsVNzLRLleZleufhkDOJXpQyvorhbzlPgmWB0iS5TG4ipwQcvaMwnkwAlG3eTL97bQHSvRVWjDCzHw+26Lk1Kx/+IYHSHP42W57p243VQF9YMXL5EKBCWNP+3sNx1YXv7G8s94zh1cWnrVzRtEDvGdoHTGkI+uzHMay2wwOTHbqyiri3r4LsCpKQHzRyOIhtWfe//mNnZMBFU8a3pqv0GyrRIPbFcjOQBGN4QSZvowVss0ljbPYaIpiAcRIU6m+W2L86d9Dj7q2YifmXNsOAExwW3agMg9V18cXsZgz49k+JvtqNxg3P/LEuIoqLM8aiiZ+x/DFLY9u+GYejLWQdSUPPgmsTQP89HOHFc8TL1z71zmuMIKghjJUIXN8KM0CcJp3kBjequi9NcSrEMCZC0lN2Cgb5t+4fvZ8z+IZvyfULG8l3Y5et4LNCs/oa86zkqgkkGKXR5ItyMzrDvT4/q58IadLj6r2YjeU06YtQZqmPXDLO5VTyfTlZdC3VioBIWZh2XMbnSxb4mDz8HGWqUxFYQPzS2DV3Zee3vWJr/HbgP3FkbyJI81Jwlu9CwcXt1CubYBb+NJrJhbwPST1gIT1ob7/z+YFFvPVkVb17mKC61ZTXWK50Mer+cNgR4I/iURGDNH+xV2bxzk+bhcZuV+TiPGLsbblumhZjH3DWOWfvGtQxDuDHA55oTxakq48tGa6zy6AgmccSXDviFlaJz+etorw9aqq/dFXNAYQYoJRWmY8dcp2tJcxc540ojewGGWHHilYDEoMh0RECe1rLXgJBFCMWOnYGtn1Qbno/c9M/QVYesNsG1TrwPdOxxEofTprGV8LBTv8ufh/1MBR/GWTLChXfO6aiFZrGzyNkQKWhUc773+D"
  },
  "appt8": {
    "salt": "GmdMTMUqIoWfvlciQKeHgA==",
    "iv": "ez6iWpvARoTiD7Y2",
    "data": "TFZrRpvPQBgqliHx1nxT+1KrNadU1KizgTC6T42VLO7/TzEwWgUKSNrRV+8qXfUHk3XUmnzo+FVQxTJXCqxKjPQ5NZkpOZFPg7WQ/0IGLXtVjQLkGQ4GgyQNEhQJyReuEMGEu5cUnWUrR50sSIVOsJlpjd2BEL2DpqC7Srmf4K0JZx1OSRWJ1PJ7nHQMiSVF/wILERXfEmjLai45nz4LMIK7xRdxYLjA+e+hWf1mMPwdwr/3raXcAPxFLS8fO46WVQXWk8/R4Q9sVYOyoLBXGrYZGyS7pf9j7786m1mkMD3YGwcg88QRkXSk+XDvY4CZ6K1hEuvRw6omx4QUWEdd5sReVIpSTgkU+O8XhiZpwCqZC8c1pHtPHyL6rg52NyXzO/TePtAPFrFQF8kKA5d/NKpeAc7iKN+M8qwXuNVBiTkJag5VoAHfut04vc6fOv/8tCnGhWTmcllrKdyzKXDu4Z4IDQzQqMrB83TmIOJ5E7qgFjEw49x3WZCzoupCHoYr2dvM3xC7goKzw96B2C9XBu7fhQ5Bu3x1Q6yVdrCI2sYN1FYuo5jLmLXL9MJIhrMUlXwjY5twedBnmYAIyLebTaZl003SrQOoq6DGghYxjDyia0YZf1Xp1cjifKFWV4MVNwl97BDUMHlbwCwTyr/uYT6J98gBFtu1SYEaQhIe2rnkrEWO0nKQkeVF3nfJNSMcuwFAbXN/lMqG81UpkE/bYed8v6KZFVwFR4LlUxiq9vqI4nYxwHnYpkNzBdzjQiAfu+riKYKlnTOtT+hgDM3mWJ2+eq+Kqa0KxdURHXm+RVMHArvmF7gGBd9gs5PWtOqHj4H8siL4GrRtHLsi+WAkrtgAqyXhzl6wDuRBsm5tATqdjVFukSHSKh+u5B9UEqrwDjg6YkUhDvnWbfdQ6EgPsinfdJQ5oHuUzlizuBoGzBUSaMoMGY85c64q+Bq0IyTgsC6Yqeltk42Ejv6UzpWvaWpeKorWofod5HB6LSqIlLS3e0ROIZG7ZeTJVzQxo0yjPKl7u05g9MACFPPN0D4yc5+WoT52FkD2aQuYZ6gaJ8M78a1qbiF1DtUF4aP0qAqk2JzEQM9Rd6XAV3RIW87jMBUe6SdYpUOnN7v7zHIdhG4W2tWi9Cut+26rkBWHav+9atpd0z/OkpJeBv/fRjTKNQpAY96S7GSrl3cJ+LyVdohaTAZCAoegsdcPj5ZpsIbxkQ7oaaKYgk+0JKVBuXGH4UTTrLpdOL68vJra9DqSkN9EUF4="
  },
  "admin": {
    "salt": "h/dCpEy7/0Sd/q4caicw6g==",
    "iv": "8NDhcRL4a7yImjMw",
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
