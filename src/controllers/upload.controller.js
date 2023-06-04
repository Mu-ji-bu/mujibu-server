const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { admin } = require('../middlewares/validateFirebaseGoogle');

const bucket = admin.storage().bucket();

const uploadFile = catchAsync(async (req, res) => {
  console.log(req.files);

  if (!req.files.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, '尚未上傳檔案');
  }

  // 取得上傳的檔案資訊列表裡面的第一個檔案
  const file = req.files[0];
  // 基於檔案的原始名稱建立一個 blob 物件
  const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`);
  // 建立一個可以寫入 blob 的物件
  const blobStream = blob.createWriteStream();

  // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
  blobStream.on('finish', () => {
    // 設定檔案的存取權限
    const config = {
      action: 'read', // 權限
      expires: '12-31-2500', // 網址的有效期限
    };
    // 取得檔案的網址
    blob.getSignedUrl(config, (err, fileUrl) => {
      res.status(httpStatus.OK).send({
        fileUrl,
      });
    });
  });

  // 如果上傳過程中發生錯誤，會觸發 error 事件
  // blobStream.on('error', (err) => {
  //   res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
  //     msg: '上傳失敗',
  //     err,
  //   });
  // });

  // 如果上傳過程中發生錯誤，會觸發 error 事件
  blobStream.on('error', (err) => {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, '上傳失敗', true, err.stack);
  });

  // 將檔案的 buffer 寫入 blobStream
  blobStream.end(file.buffer);
});

module.exports = {
  uploadFile,
};
