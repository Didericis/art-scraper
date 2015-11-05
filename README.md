# art-scraper
A way for getting content for artfunknet

### Requirements

* Chrome
* Selenium driver - [download](https://sites.google.com/a/chromium.org/chromedriver/downloads)

### Installation

1. Clone
* Run `npm install`

### Run

`node artScraper.js [<options>]`

### Options

Option            | Optional     | Type     | Description
---               | ---          | ---      | ---
`-p`, `--path`    | No           | `String` | `Path to browser download location`
`-n`, `--number`  | Yes          | `Boolean`| `Number of art pieces to download`
`-s`, `--starting`| Yes          | `Number` | `Starting id of art piece`
`-e`, `--exculde` | Yes          | `Numbers`| `Art piece ids to exclude`

### ToDo

- [x] Figure out how to wait for result of click event
- [x] Parse art information
- [x] Store picture
