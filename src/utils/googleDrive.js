require("dotenv").config();

const { google } = require("googleapis");
const fs = require("fs");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.DRIVE_REFRESH_TOKEN,
});

const uploadGoogleDrive = async (file) => {
  try {
    const drive = google.drive({
      version: "v3",
      auth: oAuth2Client,
    });

    const response = await drive.files.create({
      requestBody: {
        name: file.filename,
        mimeType: file.mimeType,
        parents: ["1-vpcHOhAY3Xir64z_IIcjhg6Bg2PR_tg"],
      },
      media: {
        mimeType: file.mimeType,
        body: fs.createReadStream(file.path),
      },
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: response.data.id,
      fields: "webViewLink, webContentLink",
    });

    return {
      id: response.data.id,
      gdLink: result.data.webViewLink,
    };
  } catch (error) {
    console.log(error);
  }
};

const uploadGoogleDriveProduct = async (file) => {
  try {
    const drive = google.drive({
      version: "v3",
      auth: oAuth2Client,
    });

    const response = await drive.files.create({
      requestBody: {
        name: file.filename,
        mimeType: file.mimeType,
        parents: ["1-vpcHOhAY3Xir64z_IIcjhg6Bg2PR_tg"],
        // parents: ['1o-FdBmJ30UZ-apwoutsGR4_gW1FIGPBU']
      },
      media: {
        mimeType: file.mimeType,
        body: fs.createReadStream(file.path),
      },
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: response.data.id,
      fields: "webViewLink, webContentLink",
    });

    return {
      id: response.data.id,
      gdLink: result.data.webViewLink,
    };
  } catch (error) {
    console.log(error);
  }
};

const deleteGoogleDrive = async (id) => {
  try {
    const drive = google.drive({
      version: "v3",
      auth: oAuth2Client,
    });
    const response = await drive.files.delete({
      fileId: id,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  uploadGoogleDrive,
  uploadGoogleDriveProduct,
  deleteGoogleDrive,
};
