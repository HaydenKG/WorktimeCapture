# worktime
A project to save the time one worked and had breaks conveniently in the browser. 
Functions:
- Track work and break time during a day
- Track your work and break time for the months
- Export of a month as .txt file

- Extras that could be implemented:
    - week page (by splitting the month array into the specific dates and displaying the new array)
    - export of the data as .xls
    - including some design changes (different landscape wallpaper for less minimal visuals)
    - set own off-days (instead of being fixed to Saturday and Sunday)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Deploy on other github branch
For now the procedure is as follows:
- run npm run build
- copy the dist folder to the docs/ directory since that is selected for github pages

https://haydenkg.github.io/WorktimeCapture/