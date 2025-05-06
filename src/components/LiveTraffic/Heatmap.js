import React from 'react';

export default class Heatmap extends React.Component {
  render() {
    return (
      <div>
        <iframe src={'/heatmap.html'} style={styles.map} title="heatMap" />
      </div>
    );
  }
}

const styles = {
  map: {
    width: '100%',
    height: '90vh',
    border: 'none'
  }
};
