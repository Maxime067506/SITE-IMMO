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
    "salt": "cvEyp0N1nLBaCjc6Ca8frw==",
    "iv": "omTACq24GkbI9D2I",
    "data": "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"
  },
  "appt2": {
    "salt": "0PWuBwUCNFx2l65C004GhQ==",
    "iv": "IvvNat6c5UFCawwQ",
    "data": "ZZcAYe6hkvoFjLuRWUknPP3NrlCmuBOiKdPF1jkCWxOnSrzNjjYYMxCxUtp0yzx+pfYnlZGmsNmnV2EVNjNFgCZCQjAe+rcKbQJknhpEmwA+x8hIt/jpDPZVZp/2YTQAGfauT3LPv+iv6Zjt3l+5kHz8mnnQK9iENMKpqpEJ+B//WpMVQH+E5xv/TzSei7PwNdV8IwLg9oYcxOQEucKCO9RJp1mjDIPJmsZ/sQdJiC8fqYBksoHkuDWJVOS0Z2B3kVwopas79R601eGwRYOrCdpNojbbhqjFUym8KTeVrzj37q0Rbe0vNcMj3kHUfwiYDjZAwRu/eJ/NCUOgjC3+gQp61kS+VUGDgaAwpGVtH3POXmTEoaGcJwM/WB9FrqVZ6luvIwEGFfvClxlFLmf9HpoAQC2Pj0aKfSd8DuAornO/TgrpBuvH9clidY6uiSonqOMs/xNc9/i0JCFAkpIXRmplzpZlZd8JElOpvLJGM+CZw93UhWQNaszRlSJh6A9xG8bLx9xaSIYdmJU8DLniGlaiq9l86RbFjlmJjVnK1v+CestjiyWd7MEb57R9NX+0Yd9V5EkpcYI0V/43ZAJtZVPWHSiBl4tVWjQ/CsyhC3F2mUnIyIQ3OZz4yqmBxpN2kQc2YWNug9sVxZprRkwDDJGpd4Ld1q6l+Hax+n2Zre//F0k+pwhuSSAQViE3EASu84Np+mJG7FQnoAyLJQeQH0ZyFmXtOplAeWIBuswJL3S7EKGy4fdOmwdTo3m0+50gd9pNQm/qpOIN/sXl1tkjuVjnQLwILTjbfEeMkmZKghmicMseIuQxwmPMruQz/DVNi31Cf7SJSKbItdvqF1jNEVYpUB9uU7WbWBQsvcHpHUKSmQzhlDLx0V07Em6dhHZw6I8byT/7ESWsDMRuyTBmW8glhA9sJxNh9txqH3wXKDsQyQOEtvKS8aKo6lxE1JdLwSocSkI2bwQqJNXVhT+CkklnBkrF8wyZC+enkaO8aE9PEGcp1/+SfNsrDVPqYKtXMxMMvlRv0QFSWDw5RXQ6AkcsHpVnGjxLH278bTRF3zy4lTVkupvoFdkTUuQuLMuP20DAiDJai7DL7vUcnFtUS9KcdBBfBZy77jpL86H9ePwmJHBJN8MswRnlVD21A0nVrREldxp/ftHa2PEF7tz/N3J7wUyw0pC2lu1BUXsJ/c95TZ1NJiYdYQeZkz1zohf3wkl8oDHNg1ajWTBe8MaUx2Jgu+11ehTw2pASYwTvU+xo4mKMuNlkLEiMGZTi2y9e0cA0yguBB0FDAacyPlN0eJA0mByP2a8yvvNuWzM8kSY6+6kdWff6HPPK/LxtkLV1dMqTL+QJZApozT0G1CQOahyZRwyoNzProm1gldQfGFInQqQDpAqMd/Sie0w4aZS7ZojfbRaINhyEU4L715wNUBgCHPQmHGQ5eslk9qKuXJPx++MKZQtE48jitUXSO409POCSgf5kx2Zly3QFA2oYnjncZ9vx0JAMELOfG2Wa3lm/8nf7jJP2XedQop7TTpOA9NiV3AIzGSrxhf6usx1YjCs3Wsk9yLRRHCXtUonBhfXSUhUB9Co5QGEpRwMt8FNB8g6uuZ2P1mTVw4k="
  },
  "appt3": {
    "salt": "xVjcFGfG+YjB5sxudC2QSQ==",
    "iv": "3m2d5hya345KZMuR",
    "data": "In9CkmJHsba+mNxxxG4Yr7/j3p6Uzqx5FdL3m0CfXCByn4n39Lk4tOTxhrAc+tmbVXNjFy/Darfzt7EGKN8XD8q4kf1qpcKrQDlafCeDr7MAV63fkqVFMWIKg31hgopKLLU/gE1e93oKCtS5MKHXAx18cw9f2Xoy0kRAg7x+KLVj3Z6EarRQnINZrzkqcs+EZ+rzyJ3yVP5EOhIi9YCEFOZFBa8syVnl2hU4tIEwCLhezlh6NuKxIGUhii30z3njcjekhCO/uUKaXAcN1SnxYowKKROEEGNjatUyKTXmZpRVCU7Q29zIn22sjaVlEiOSzcr1TDJ3rwdjpVKW/6xR0gj1H95mHj7+tPsU5Lio3SUf36u2LDeXz3twAK70NPSxg0E2U8iKNylYaCZ2EQIN2QxAMCYzzY6bga6OgT9Dm0pLCwmWqLYPwGD03F2poW2wcOZEd76XxgJwTyFqkvuKUW/i79m+OoMT6koHgmJMMQnVaH98T84xpP39sXV/JVKI/JqKx39ldndO8QNXPZ0c6lbJISHt0n6Ckib1md5DARQbHSKO7iJ2yMvlhg4RQpFkzpnyBrcnY4ZR4w2c9ZGJ6zYpfuJIEn7zYsQ4gwyKRXNzF5S1NHHfRtmKdKgOiMqOmZ7BSg1WHbxeSmu5Y8pelua9/yGYX4Wq300c07TDHQZ9Ukn1LrRgnnQVqbYNRqipTOXsFwA+E3mRAM8KSH1YgoFm0FaJTLWzSkFB4OAepDuHSNn+Dt2y+D7eNeI2aMZUjtpITM8wOWvSpeQdd+EomlftlklLljk3YA0P0jIhplMA3qbGD+eg/tYeeC4RNsnh1fBuQuRWin9O2LdD/1xuO/4e8kIs2fFDiHTxCj8WJrCjlNZVnbd3m1JXFFwbLOvjI+qvk4DQA1JTJwiR1e4MvEF7p2yS9YbYoWYySAjeKc00J/SeEFa5j8ST293nCtETMi1Hpeq5ud6aEI9W7AyIMzk3BuB4yc2veIvAdmWRMyqJ9W4VpbPGGqFYD1jkeUUZtB6ZLPtFTQmkSuVyUG0oV6Ib0fikphakLPCRAfWNz5s1OMSPQ6WoFQYcsKAZ2SkFkmlau/5NhzzsoiA9YTVJh9DFcPWlo1fzxC8bEXzetz0M7GwnDnvGIcz/Lvu52CZpGMj8d8rs3mBSQElVxNTnybFaqv3s56IKz+NR7TjQf9lT21xWyCXLs/DNDBn9CDXmlQ4XXwKXnNpqt4qib0lijIOaUMgqt+5D+M3qpgljibqOA06BMoxlmCpvlM36d/G2dxC+3x0euVgTshVZXf4cIus4rFaWdqjG4xARQtLRCP8Bek0op7FeffvwyxwFnFWC5uNrWfF4/XGgKv0ojwG1BTY8TQlm9jLXmHmwoCaXUoC6YtcLngV8QlLuJ+mii7WKfQWbv0dzGm8+CHiEi3ayyrzXroce5u4AKbhm//6bVAtXzc4BgbGwOLtkEtUGPkipkagnNz6lRJfMmc/oMnp6YkwtJ3C2Q7/ox+dgOeqJYCy7iK2FUWSXwQVoSg=="
  },
  "appt4": {
    "salt": "SK6i74q+hUylAhfdVjFjww==",
    "iv": "t3yNYWrKFS2KopZW",
    "data": "bdbtHT9gc7T7deuV5okvcl7AdiXJokhZqikQ/GiH1hJm7Kp2ppF2mncLveV+MiSSkbEagBWzvRwwypRqqeuwiIspC66CU1O6iZu4k9pQtUB5FdgreHRN6cBziXR6RkhQU5vx5dy/RilvU+EBuf445Xrdj905E+b6B8fRCiCcyYdzDBmFWph4do05ATiu4L/gAwumt2HwwOot9ciQW0r6GYG098WlWAhp6NLxhpAxK9Z8WNgyfGZYpGceLLHClzkj9Hr7hF/lwR4/hpz09c6UMvwcQQYI/6ipFNAgyH16ehFAp1WPjyiFuyb9Te2yrkspQnRbAsLPztwGZiVe7vIPNXlIwzy7yCPbFCKsiv8LK7C2E7eaPcf8NIrXY6RchFBJsTxJnyG2odRY5t37muYLRkT7/i+ZKB1iaaEP7ggOou76ToKSbJ1QfbmtA2zEbCDrFn2oysd1otLa6be4LeqN+ixMI3I6wjlj7sAJ0EhskxdUUNzdLs7NvUHvcyImuGFG5Mdp30cLmW6fNbSp1Sg62CZKOGFltkl+tPYdQlPdGS7LvFp8x/Yxi6GiruPTc7Z+OZzQ/R9NvoVddOELdK3ZpS4BcvQ++TGAbfKCtOTvcLH4dG/F1dOatvlEBX41Zd/pWF1fhl0xhz3VU82ZtNX9YwnYHI0QhygMPJVSXoliThK/JcFZ8tZ/bjgh9zXwB8URInuEvKZONf85HlWc0AjEBqpCx78IW7EbKncUKfovQiiV0SwaEqbQayKQ6itQmjz1GMSw4Z1hQv8oUGbJlswcajs5tNt+Hd12eno7o5J4xd7i3J45+At8oUTcFPrBmKGbiBsTBe59FStnuqZP0XERLjz9UjlJBgDccAdxly9NFsI6xpxumtGMOLNfXns5WLKtrkJ0tzHV7x6hWPsAhUIuTdXSLtn7PuRpQa6k4sEAYBOlzNQf0SJP++IAm3n7XKPnbLfQQAsiI0jmQM9g8XpvYWUMW9HAK3/ZP/Ls7VR/mwADMcI+cU176pe0OuLhJ8SVHJ+Gt45rbduT3Ito4yT/tnP4M2CbMGsysygfKefpJTp6HqgLxhcA1CZLTEIc/L6VSaMXgU1z0kSu7GDBzq99N7hIt3l8IvTUfaidOSW5G1BH5UN2EQw+k5DD7fStjOXau+MBEFt69moOMXQ4SGjt7Ld9B9B5mFRHz0CGtuKHIDaw/TVbq2A7LtvuTJgPuFuPTODjtN08LFX7pzoWLxlPmtVFwGh1qHngj3/a9dHwWPmqyLU3HBS9nbt5SJGz0RUkT4mHAQCjsY2gyiFg3y9XDt2JluYbmYzI8L0IrMh/wz9Tcr7QH+l6m4I8Wck+QjYxrSJLerc4cq8hr4BoJeHJrIiWjYFI4GaZRvKtzgci6FtloBN+pr3Z6Q+c0jQIO+zRLhyehR4ocAZwT2Rxu7n118/+2Cf8t0pb4syUkieJmOM+ANrPX9IJbaUKLgt6NuQm8P6NGLeRYv9I5a9QZ2LPOM8jhEi1SQhqSTr7+iynNr41pZiPd0Py3VseCzuATYaiMs/GT6M7faUF5rUELOmOv6CR66o9A8cz6P2q4i5wAmLIuqjSlOf56YcqpUnuz4THKvDQCtkt47EYjFMt"
  },
  "appt5": {
    "salt": "kJhcJT4TehLQ8gbxF3NE/A==",
    "iv": "dMw1EmNVMgJRyEXQ",
    "data": "xq15yrVOe/vzXqp6itZnjMEejJPUkg5LYclm2Kut1sq/rK+iOkkVrntI3mihlHbJpCvlLd74WEd9cZXx7l4LaaXeixSGT96twlz1YRVEitIccwVT9tfQvQm+MfxMIpSEZTfCkny7SXXWswo/pIUQCbPxcV9zvkMOKBNPx8Y3wlc5fHOFoRy5WlSSHufJmiJ+HyVE2SoYrgVlwYk2jwUBJVBnTT5/r56qsN9XFuJOnEEdMl0K1gPiZehFyVF3nCOzqLL1dlRH+LEzosTml2TlKuLg1LTtArlpAu/v1zz5GrX6DsU6sWMP17pGAgrnKfqoTohpcWonnUf8DzsVPjrobhQ+GVu++tt3WUgQhmk+4zfaBsAKf/QTOBEAu402f7ZVQeQwpIQwpegn3N5146YCPO/T/u29LlArxkXauSJzXRR9h1Oo/QTgEQBov0/0klAjMSIaFwiEo8M9QwDyKZokZ4TwFyw93Z9J8DpzsMghQlDbprnII99DIUE2mW6eKTWDktMFW4Ya6AOM5Kt3Pzmd2ORH7ncEYfTHLx57ybxqjCDuG2nYla9PSi97Sc1H7xEAIqI41Y7fgEXthtihnEzlgUjq+Nd0S+VJxJ3C5rqDRHC+V70sxsxf6qsWXNqjtqveY9dJaqUAX9IT/wEZIl8FA4xmV66X7S11B0Y/EZ6uGwFJJiYkLjYdziTAXdA0pz/vaoOcUcro/Pu4bPK3CgJLwlojtJ4ihF0BRvXcCDcUYgOB7YoRisnFedSllYd6EmXwtzZTWtyRUfbmemoaEnajGJqGZSrmuJa+6yUm9V1r4Rr6zYo/M0pFAByv0HsAG+BOvKp0nBqibeeww5SAb4KesZ9ioP3MXaJTQ2g1aRpab+zMjMgxV8mbz0fedEEA0quMJyL2BNjyURDjjOpxkDRGalU9vcuX9dybkp1khnQDbKtHVUgecYDc/kcCLyS/Fhmlibx+LVl2DVLdDjMfqvOSfUU9GRDPw84JTFuNtXbFAZC7Er8qQIkpFSAWLsyck9Wk4KmDIQjst5XCyKUxuuo2xJRQ0HmAtfyJrr68vuHKXOw2x8r0CfSudAVfxKPLmFzjIq3hkiEqw5qTcjCRHs2TD02qqAW5BRdxvTJn7TZQZtSSR2ZVzS7YQbEs8uY1E0YVEl8xFXLWmfVpLMkfFSaYT5hmMUmGAHOdoly89JD2Ezd1vJeGWPGs1g89qIF2/SialXxCS5Ynwm/gZkWYI1im8JywzdoDKaucbbvl85auG7vjK06YLEfVIGHngKqdWejY10qKLydDkNeDZ+z7fUJfX3SKOdh5Dpt2ci0mFbYRYLd3LUsnsOylWaiJpJ1oNNdG1zTbr0c9UKZZzToMpZgCNzxiAuDY3wYpOrWx8FaqLdK9CwqcfrKVE6GaBv3kekUPsF0iaUkAuKHSkH70bceB/vUp6u97fNKAyI9LSqmRdMokc3EeP8Am8hBRiwncsJAc4kA7CJnzHIkPI1jRXNNMqSk7oJCvGYPeqr8/f5Iiq1+A8H5SMYCry6V/GnlvFisp8EacCpzwA+zk8EDLlY8JuvxScmdA9xsqFfUCjzRxzQNm8LspFW7Rr2m2ka3waKHnCGfNLTKIe6ZIkXmAXLRWyckqEgtQsAtOCwdyXeLbSQmZMbbDeHkOFarhJexYNw/BTLZ8J7NmS5ooK20bK0XbJQv8L9MakOfPsST/YpGz66N02udopLUPhvKMNdNNz/wmM9QbvDsOe2uFes+0O7tG31x3OAoKqu8VcYFCgxGvlGn1rXIHhCOupV3mbAiVx6M18pilTny5WnadXMKXTHmSazW41EVkpMcqLrpzhxeytIJA1mQnj8rdVcE9vW2/ZbSiEb8vMKYbBjpk1Txx4j+Imvcqev6QBmJ4kd6DoOYicByG2Qp/FR64lPr4Zfw6sYaHNdo4v4KlVPq8Bfs1N7vH8Y5k8Le8DN0KorPlfeB+a3yRfHIRMBSCsByDCHETv+skCb8FPgysAYI="
  },
  "appt6": {
    "salt": "nyZEQUksWbx0UoyiVwxRVw==",
    "iv": "+qjS7FAohLjVXbci",
    "data": "Qrn6qQDsouc11Dq9yQ+/owYOa9bFya9N2A73IkZ5Akw2Pq6QvTX9XztPGrmB0iggm+gnlcjV+Ja/t28VPdSStX/H1F2XtGaUe7rRf/NjOfa9CXBAwj+Lnvrt+JICE2spjtZfUChkzdd5km4JoskkdT9Yc0UDsNrnpFWv8V50uL6i5Vf8/Fp2lb2C3hIgIsHVphw3v1hc8JyUfivxoykz5wfDJZZrHq6C+kskn9noc/4y2ZfIZ7NF1nPWG4xSo8zLJL+mY6maM0OlSazZlJmF1oUBcOOC5VGT6Ns/c4Plw5nSLyfoQG0FAWF746hcmaEWPDaF+Lchau+Xd2dQoc9UG+wg4N6pkIBiVuP5rOCU7mpoAggIxxolS69pYrJBJBVfseKkC3iCtLZS1tRrwgaC7ufRudRZVJxuNKi24nu51Hwjrp1gTu8yV1ADVt6zjKYel7Qd30pOCKH3Bgb05Vb6pmzowAmpWy1lQC6JOvFqJB97gtqZPZ7IrIILCNhy9wvsztcfBrP7zPijo7PLKr5trNhNOX4tviOw55HMbgjXlL42/Y6exXvOWii+MCX1KrLW/xNsXIoM8GACFMabvCyTNQsRTyIhxyn8Pl2YDXgdxL1QpvqFdqc6bHvGZfpvsL4F3cpouJl3cx2RX2dOc7dWkkTU3DCHJOsUMjlpJyHMWcYUKBlpZDDPRiPf1vPB9BpmdI4fFOw3nauGA/5n+nSVCrpFjYJGY3gxHvARLLvKx9At06iCN71LpQVaxa9XPr7vjH68755AObgS5YP6+KjdiyV4BoGDTA49k5uUGaih/H3VllvOLIGb9VBJ1WLPUtn73Xetdl9XX2mpgAPssxhECrK5LS8hFZQG4td/Mb9KNzObUNbkbofOMCM/AZtzWykYgTfRJ5HsGCamww2HNfF8alHml863u2o3hY3ubIXCEpbwzNLFs5p9aFaJLLJi1zDXpil6/5n94Z7+ACoGuXhv4BaxlGD3I49HcYZc5Pgo8oKDnJ5L19innMyX/atc62oVv1rYBZ+yvZ3KTskGvoALfoWhsOfCZgAMcLOlfhSvfunBujSkRhc9e/IHH6pyiYh89WTuqAGoSnHLYKH4BFD+3tVn4bvi1a3yC0KWFaHXDghs/O8ebmWkcACoeEmZC3VYawKNMX+H/ZxQ85vSSc4SuRnINmeZkqUOycIDwS3eRz/sGrUb4cJjUfgr7g1T/I38iFO0YoEcc0eQkqcWju+wZv67+Pjdx2Zwqra3D3i+Ft7owzUsuulAXs4u4AVJjXbxOQklIxmEn5N3SEMArl9YGCdvCCoWBqVlPHTielVV5OJKWx6h41zgHwh9JxYn/4G3JARuliiGn/C7l9Ts1T7RP/naa/21V8B2TT7RsIUfVxtBVjdKGHAGy0GYiT0bWW5cUINSxW1IKo0vhLSKfkMDPi7iYET5jhJG6M3/89TVoyVzfp16LISHiWo51VR+s61tdw/weF/zkiQO7A0MnCe5Jlh7LLiWWqb/4A/gSd3Wd5wRToGfO5IDC1WO0oBlBuc2fVzQ0KWIvzYKvzkjFhcxJ8custkxN59y04jCQN6Z23+7xNzS5bQv6zjfCXxzz7je4pgOjv699ZRmlT7QPueIOFVajL2Bme6sU9IM0qYQOg3brelLzdZPyj8NEiAPN7dZLV+mQdHAYYEornaG+3pRTjWmcJlw6iqod8zLv0c4lhke1IAICeqt86P4VomX2f8wBDOnObboH+OIWZeWfPVj1aMeoI0hYV9bameaiLGPQ4QhgivopdNB2vbcQa4aFW02L/Jz8seeqmHlpZbKCy8iRYSZH7Xa+68TP0YEPDATn7WDMKgrs+cLfjPwmH7qNuaZSNIkpoYPfynxP3mCqfnFWYUm6V9UxInIpfzT5kZgCZQrEY0="
  },
  "appt7": {
    "salt": "aZZaEFk5IyS1seS01Du7Ag==",
    "iv": "jMJ+T2yZp3Ro01VG",
    "data": "f7mLP6DqVo0dkuD7ylRb2HSPHuMEiU7ThXczkUm9Me4cEhHsZ+kov0BWOxR/ItL22sLmI8RoCtRRFUEbVE+/vGTCOzw63Tubu/ZQi5CpWEdiTELQdko+V6aU5QDPrYX1jjtOeZTp3Al+GtylMVqFkbF/tpmsK1hPL6bIeqQtl9E0WsI5CdpdWuUceItNvGBMO0ClhxppN62A+U0iOPiGQcT9s4oTjnh4AJGYF8y3x3kzuASALlqEfHq2/FyVh2ipAmwrnN/KFAh8kY2gYAjd9wv4fMifvDJ25LBKsS5rHu4bkhc8tLeryiJSuote7IXNqzVF5hrC7se0ClVIDrx4AMq0fsQsjlzD+J9clQw3oWmX9HF3QPRvNOjD19tLpI/y5iaYBvAlIT1Hiq86PGF36J7LsKH9rrZr0JCSK7PDwsEalggMVwPurAgS+Zw3ar2ZCVnnkM3edCETuPIVxSi3U4RU31ORqb90Wovec1V4boz6ntSsaCFQyNKo28wfzgEfZeORsILemPzMqckTAhonQDfoLWEDDXVE4uDjLJ0oMKjDDJ6Qdnli2JqsiHR8Rpyh3sW5dtJEeUfF1ofjM22LnTCrqtReXOBEiuwRwLVUECtAUQSgfM9JTf23cfR+P7vi/C1N0494BH5UiGq3uFIU9LRPZhrvce3g0VBnomT50KPAxMfPGOes/Z5OuBnjYLfTLqyMSv+w0YPc9Fdwl7tfsgMIz2QdVzksyIAb5mTgA+WkQSJ/iP0dCv8U1X6cqsyMZO13DXzMWnfXALU8Wa5TPoPOLeuhPsUULL35eov17hNFLk++7ttKW60/thqXI6TGZ9bKu37HQ1cBK+Iiy+FL1qdCeJZU29svxntf+xnpFkJCa3KK1GCUCg8eGymj46++vfQFnxbPL46cLIsW2/tfxO9lDicAJMyjf+hzgRXIfj9XgnVL7tfN50skJdIf6bhnkNAR2gFYIPE/2450SaLYd2DHZjNASavJPw9K1DZ7Wo8mOpnU19RHbH8gIKUh+TmxAWFNuVYcvRXkd8zN6OElkZoulyBBYjpgUTzmz3lB7s3uky8zBipf1+/x2fLbohRnl/bVbfFXu5lIGa8ZhcrF81zlrfyql5VfjWFi7xAvwRH2e2xUpNLzOZpIpjEpUw0SeH1NYlseW3ud5hTxU3eNnND1qyN3wQRokxA6BkTxGxNsvxhW84sRtt2uwxC9+Dd68/3ExTYEcL4eEb8mod1Ldafl7SMno5OhNT21IOCs1f7fp7DIwWyDKuHAYpMC+0Z2L6ggyGJ1XAYyCgv1XRSJFJfGaQcsXEEyRkdmgOxW9d1N8igE9ySdUgFVkzrfgWJV4XdjbRUm90orVCQwJNZc3pjQo5IlEjJxuhTOowHIKd5NmBs0mXt43H17RnFAMceDtV6trcTf8CWnpRVfm4WDRq++q/KBA8K3zuSV5k1Uzmq3JM+zfVNPT90iUygARoEkQJ9NJZQV4NSrNL+MTSSYE0Zaj+lQId3g9GNV/DLTc81HiIWOhvSzu1IZ7VAaw2uaCK283CRHJ9bQqaUhuhgo2qdg/fRuVQyE1b8J4sFy+jVKPfU2r7lgcMUoLmTeRDnJxbM5DbZD/5qOG8zjVqx67htrf9QHBW8mW8JEJHtQVttFblG4dPy0/AQShR+9NYGXZcndLD0w1770mAdW5WTs1wysoom7z4CufX2/dkb8DizLffbov2LKuUttdqah5/WQPx4LA7FWJ5hxvBEMKM5v35I9qmKBvtGF03iEBo1co19zZnqXB2nE0B0tvH9I7Uw+odiMhGJMELR2AlK/rBI5X15HdPxrEeI3KctX3cfNyrpEjZFKR61mPijke7ypgWUgo3WSWeZTnaxdtpQ90+iw0bUMTIaMKFieFsUf0ZzQ+qxNdUJeIgIzq+Hal8U3HRAN9+r6FQWvdq2l4x0bURaQeaNzWdX5"
  },
  "admin": {
    "salt": "3bOvLTCnQhSwed07jaot+A==",
    "iv": "l6eHyvIPiakfoS8w",
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
