# Visitor-Center-Log
Web application that renders a 3D globe populated with pins highlighting hometowns of visitors whom visit the visitor's center. This is jsut a prototype thrown together real quick as a proof of concept for a project bid, so it's a little messy.

- User types in the name of a location and the app auto completes possible locations.
- When location is confirmed a pin at the correct latitude and longitude is added to the globe.
- Information about the location and who added it is available by clicking on the pin.
- Geolocation was accomplished with an offline database of locations to remove the need of a dedicated internet connection.
- All users and locations can be saved to an external file available for data analysis.

<p align="center">
  <img style="margin: auto;" src ="images/preview.gif" />
</p>

### Usage

- Download, unzip and open root folder.
- Open powershell from within root folder.
- Run 'npm install'.
- Run 'http-server'.
- Go to http://localhost:8080/ using internet browser.

<p align="center">
  <img style="margin: auto;" src ="images/setup.gif" />
</p>
