import React from 'react';
import styles from './styles.scss';

interface BackgroundTextureProps {}

const BackgroundTexture: React.FC<BackgroundTextureProps> = () => {
  return (
    <div className={styles.root}>
      Find me in <strong>src/components/BackgroundTexture</strong>
    </div>
  );
}

export default BackgroundTexture;
