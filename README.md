# mini_programme
This is a Bluetooth mini programme

##2021-7-21(gaoym)
* add searching button and a reminder to make sure open bluetooth.

## 2021-7-16(yanghl)
* the ble device finding and connecting period is not stable, the phone always cannot connect to the Nordic chip

## 2021-7-13(yanghl, add some code)
* scan the qr code to get the device name, and find its device id for connection.
* add the `figures` folder(an example qr code picture is in it).
* some problems: (Not fixed)the first scan and device search period always fails, return to the 'QR Scan' page and try again can get the correct result

## 2021-7-2(yanghl, create qr_scanner page for ble connection through QR code)
* use `idnex` page as the default `onlaunch` pages, use a button to navigate to QR scanner.
* initialized the `qr_scanner` folder as the default page.

## 2021-7-1(yanghl, for vscode develop testing)
* delete the unnecessary files in the project, add the essential \emph{hello world} setup files.
* removed the code in `app.js` file to avoid errors.
* removed the `log` folder.
