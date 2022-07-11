const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();
// Initialize the sheet - doc ID is the long id in the sheets URL
const creds = require("../spreadsheet.json");

const doc = new GoogleSpreadsheet(
    "134nUeYUXY6x_boMADaH3RZAK0XWu3tGxyZ9rcYI3IPM"
);

const updateRow = async(body, idtoko) => {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const data = await sheet.getRows();
    for (let item of data) {
        if (item["idtoko"] == idtoko) {
            Object.keys(body).forEach((key) => {
                if (key !== "idtoko") {
                    item[key] = body[key];
                }
            });
            await item.save();
        }
    }
};

const addRow = async(data) => {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow(data);
};

module.exports = {
    updateRow: updateRow,
    addRow: addRow,
};