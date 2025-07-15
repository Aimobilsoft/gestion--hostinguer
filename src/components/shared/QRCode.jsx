import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCode = ({ value }) => {
  if (!value) return null;

  return (
    <QRCodeCanvas
      value={value}
      size={96}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level={"L"}
      includeMargin={false}
      className="border-4 border-white shadow-lg"
    />
  );
};

export default QRCode;