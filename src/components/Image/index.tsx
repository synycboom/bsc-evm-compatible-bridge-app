import { useEffect, useState } from 'react';
import FileImageOutlined from '@ant-design/icons/FileImageOutlined';
import Title from 'antd/lib/typography/Title';
import ImageStyle from './style';

const Image = ({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number | string;
  height?: number | string;
}) => {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(!src);
  }, [src]);
  return (
    <ImageStyle style={{ width, height }}>
      {isError ? (
        <div className='error-container'>
          <FileImageOutlined />
          <Title level={5}>No Image</Title>
        </div>
      ) : (
        <img
          alt={alt}
          src={src}
          onError={() => {
            setIsError(true);
          }}
        />
      )}
    </ImageStyle>
  );
};

export default Image;
