# Vehicle Selector App

A sleek and responsive web-based application that allows users to select a vehicle (Year, Make, Model), store it in local storage, and generate dynamic URLs to browse parts. Designed with **user experience**, **localStorage persistence**, and **modern UI design** in mind.

## Live Demo  
[Click here to try the Partify Vehicle Selector](https://rvamshi1711.github.io/Partify/)

## Features

- Modal-based form to **add a vehicle** with `Year`, `Make`, and `Model`.
- **Local storage** to keep a list of recently selected vehicles.
- Auto-generated **dynamic URLs** like `https://partifyusa.com/collections/2015-ram-1500`.
- If a **product type** is selected, it appends to the URL like  
  `https://partifyusa.com/collections/2015-ram-1500?filter.p.product_type=Front+Bumper`.
- Displays a **list of saved vehicles** with delete functionality.
- Fully built with **vanilla HTML, CSS, and JavaScript** (no dependencies).
- Maintains a **fluid UI** with no page reloads.

## How It Works

1. User clicks **"Select or Add a Vehicle"** on the landing page.
2. A **modal popup** appears listing saved vehicles, or prompting to add one if none exist.
3. After selecting or adding a vehicle, the app:
   - Saves it to `localStorage`.
   - Redirects the user to the appropriate product URL.
4. Users can **remove vehicles** from the garage or add new ones anytime.


