import React from 'react';
import QRCode from 'qrcode';


// We need to abstract this and the baseUrl of server in "axios.service.ts" to an env file
const baseUrl = "http://localhost:3001";

interface ImageQRCodeProps {
  imageId: number;
}

const ImageQRCode = (props: ImageQRCodeProps) => {
  const [qrUrl, setQRUrl] = React.useState("");
  QRCode.toDataURL(`${baseUrl}/image/display?imageId=${props.imageId}`).then((value) => {
    console.log(value);
    setQRUrl(value);
  });

  return qrUrl ? (<img src={qrUrl} />) : (<div></div>);
};

export default ImageQRCode;