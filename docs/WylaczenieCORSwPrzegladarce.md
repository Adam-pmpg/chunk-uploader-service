# Problem z CORS

- CMS wprost.ss pracuje bez SSL

## Wyłączenie CORS'ów dla Chrome
- trzeba przeglądarkę uruchomić z flagą

### uBuntu
```
google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev" --disable-site-isolation-trials
```
### Windows
```
chrome.exe --user-data-dir="C:\chrome_dev" --disable-web-security
```

### Firefox

Wpisz about:config w pasku adresu

Wyszukaj security.fileuri.strict_origin_policy i ustaw ją na false
